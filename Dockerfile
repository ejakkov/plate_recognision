FROM node:18

WORKDIR /carplates

RUN apt-get update && apt-get install -y docker.io

WORKDIR /carplates/openalpr

WORKDIR /carplates
RUN mkdir -p /carplates/tmp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "exp.js"]