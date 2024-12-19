const express = require('express');
const multer = require('multer');
const Minio = require('minio');
const amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid').v4;
const mongoose = require('mongoose');
const { exec } = require('child_process');
require('dotenv').config();
const path = require('path');
const app = express();
const nodemailer = require('nodemailer'); 

const platesSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    uploadTime: { type: Date, default: Date.now },
    plateNumber: { type: String, required: false },
    processingStatus: { type: String, default: 'pending' } 
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: 'kdzenis27@gmail.com',
        pass: ''       
    }
});

const File = mongoose.model('File', platesSchema);

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
});

const queueToALPR = 'queue_to_alpr';                               // Queue, kas ies no bildes sākotnējās ielādes uz ALPR(Pirms nr. zīmes apstrādes)
const queueToDB = 'queue_to_db';                                  // Queue, kas ies no ALPR uz datu bāzi(Pēc nr. zīmes apstrādes)

minioClient.makeBucket('licence-plates', '', (err) => {
    if (err) {
        console.error('Error creating bucket:', err);
    } else {
        console.log('Bucket created successfully.');
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const queue = 'openalpr-processing';

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }

    global.email = req.body.email;

    if (!email) {
        return res.status(400).send({ error: 'No receiver email provided' });
    }

    const fileUuid = uuidv4();
    const originalName = req.file.originalname;
    const fileName = `${fileUuid}-${originalName}`;

    try {
        await uploadToMinio(req.file, fileName);

        const message = JSON.stringify({
            fileName: fileName,
            uploadTime: new Date().toISOString(),
            email: email
        });
        sendToRabbitMQ(queueToALPR,  message);

        res.status(200).send({
            message: 'File uploaded successfully!',
            fileUuid: fileUuid,
            originalName: originalName,
            fileName: fileName,
            email: email
        });
    } catch (err) {
        console.error('Error handling upload:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

async function uploadToMinio(file, fileName) {
    return new Promise((resolve, reject) => {
        const objectName = fileName;
        minioClient.putObject('licence-plates', objectName, file.buffer, (err, etag) => {
            if (err) {
                console.error('Error uploading file to MinIO:', err);
                return reject(err);
            }
            console.log('File uploaded successfully to MinIO:', fileName);
            resolve(etag);
        });
    });
}

function sendToRabbitMQ(queue, message) {
    amqp.connect('amqp://rabbitmq', (error0, connection) => {
        if (error0) {
            console.error('RabbitMQ connection error:', error0);
            return;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                console.error('RabbitMQ channel error:', error1);
                return;
            }

            channel.assertQueue(queue, { durable: false });

            channel.sendToQueue(queue, Buffer.from(message));
            console.log(`Sent message to RabbitMQ: ${message}`);
        });
    });
}

async function waitForRabbitMQ(url, retries = 10, delay = 2000) {
    return new Promise((resolve, reject) => {
        const tryConnect = (attemptsLeft) => {
            amqp.connect(url, (err, connection) => {
                if (err) {
                    if (attemptsLeft <= 0) {
                        reject(new Error('RabbitMQ is not ready'));
                    } else {
                        console.log(`RabbitMQ not ready yet, retrying in ${delay}ms...`);
                        setTimeout(() => tryConnect(attemptsLeft - 1), delay);
                    }
                } else {
                    connection.close();
                    resolve();
                }
            });
        };
        tryConnect(retries);
    });
}

async function receiveMessage(queue, fProcessMessage = null) {
    const rabbitMQUrl = 'amqp://rabbitmq';
    try {
        // Wait until RabbitMQ is ready
        await waitForRabbitMQ(rabbitMQUrl);

        amqp.connect(rabbitMQUrl, (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                channel.assertQueue(queue, { durable: false });

                channel.consume(queue, (msg) => {
                    console.log(`Received message: ${msg.content.toString()}`);
                    const msgJson = JSON.parse(msg.content.toString());
                    if (fProcessMessage.name === 'processImageFromMinIO') {
                        console.log(msgJson.fileName.toString())
                        fProcessMessage(msgJson.fileName.toString());
                    } else if (fProcessMessage === checkFileInDatabase)  {
                        fProcessMessage(msgJson.fileName, msgJson.plate)
                    }
                    channel.ack(msg);
                    console.log(`Waiting for messages on ${queue} ...`);
                });
            });
        });
    } catch (err) {
        console.error(`Failed to connect to RabbitMQ: ${err.message}`);
    }
}

function processImageFromMinIO(fileName) {
    minioClient.fGetObject('licence-plates', fileName, path.join(__dirname, `/tmp/${fileName}`), (err, dataStream) => {
        if (err) {
            console.error('Error fetching file from MinIO:', err);
            return;
        }
    })

    const alprCommand = `docker run --rm -i -v alpr_bildites_makoniti:/data openalpr/openalpr -c eu ${fileName}`;
    console.log(`Running OpenALPR with command: ${alprCommand}`);

    exec(alprCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running OpenALPR: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`OpenALPR Error: ${stderr}`);
            return;
        }
        console.log(`OpenALPR Result: ${stdout}`);
        const lines = stdout.split('\n');
    
        const plateRegex = /-\s+([A-Za-z0-9]+)\s+confidence/;

        const match = lines.find(line => plateRegex.test(line));
        if (match) {
            const plate = match.match(plateRegex)[1];
            console.log(`Detected License Plate: ${plate}`);
            const message = JSON.stringify({
                fileName: fileName,
                plate: plate
            });

            sendToRabbitMQ(queueToDB, message);
        } else {
            console.log('No valid license plate detected.');
        }

    })
}

async function checkFileInDatabase(fileName, plate) {
    try {
        const existingFile = await File.findOne({ plateNumber: plate });

        if (existingFile) {
            if (existingFile.processingStatus === 'done') {
                // car is marked as left the parking lot, so mark it as back in
                existingFile.processingStatus = 'pending'; 
                existingFile.uploadTime = new Date(); 
                await existingFile.save();
                console.log(`Plate ${plate} marked as back in parking lot.`);
            } else if (existingFile.processingStatus === 'pending') {
                // car is already in parking lot, calculate time elapsed
                const timeElapsed = Date.now() - new Date(existingFile.uploadTime).getTime();
                const minutesElapsed = Math.floor(timeElapsed / (1000 * 60)); // In minutes
                console.log(`Plate ${plate} already exists. Time elapsed since upload: ${minutesElapsed} minutes`);
                existingFile.processingStatus = 'done';
                await existingFile.save();
                await sendEmail(email, plate, minutesElapsed); 
            }
        } else {
            console.log(`Plate ${plate} not found in database. Saving as new entry.`);
            await saveFileToDatabase(fileName, plate);
        }
    } catch (err) {
        console.error('Error finding file in the database by plate:', err);
    }
}

async function sendEmail(to, plate, minutesElapsed) {
    const mailOptions = {
        from: 'kdzenis27@gmail.com',
        to: to,
        subject: 'Stāvvietas ziņojums',
        text: `Transportlīdzeklis ar numurzīmi: ${plate}\n Stāvvietā pavadītais laiks: ${minutesElapsed} minūtes`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


async function saveFileToDatabase(fileName, plate) {
    const fileDoc = new File({
        uuid: uuidv4(),
        originalName: fileName,
        fileName: fileName,
        plateNumber: plate,
        uploadTime: new Date(),
        processingStatus: 'pending'
    });

    try {
        const savedFile = await fileDoc.save();
        console.log('File saved with plate number:', savedFile);
    } catch (err) {
        console.error('Error saving file with plate number:', err);
    }
}

receiveMessage(queueToALPR, processImageFromMinIO); 
receiveMessage(queueToDB, checkFileInDatabase);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});