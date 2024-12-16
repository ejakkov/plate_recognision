/*
 * MinIO Javascript Library for Amazon S3 Compatible Cloud Storage, (C) 2015, 2016 MinIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isString } from "./helper.mjs";

// List of currently supported endpoints.
const awsS3Endpoint = {
  'us-east-1': 's3.amazonaws.com',
  'us-east-2': 's3-us-east-2.amazonaws.com',
  'us-west-1': 's3-us-west-1.amazonaws.com',
  'us-west-2': 's3-us-west-2.amazonaws.com',
  'ca-central-1': 's3.ca-central-1.amazonaws.com',
  'eu-west-1': 's3-eu-west-1.amazonaws.com',
  'eu-west-2': 's3-eu-west-2.amazonaws.com',
  'sa-east-1': 's3-sa-east-1.amazonaws.com',
  'eu-central-1': 's3-eu-central-1.amazonaws.com',
  'ap-south-1': 's3-ap-south-1.amazonaws.com',
  'ap-southeast-1': 's3-ap-southeast-1.amazonaws.com',
  'ap-southeast-2': 's3-ap-southeast-2.amazonaws.com',
  'ap-southeast-3': 's3-ap-southeast-3.amazonaws.com',
  'ap-northeast-1': 's3-ap-northeast-1.amazonaws.com',
  'cn-north-1': 's3.cn-north-1.amazonaws.com.cn',
  'ap-east-1': 's3.ap-east-1.amazonaws.com',
  'eu-north-1': 's3.eu-north-1.amazonaws.com'
  // Add new endpoints here.
};

// getS3Endpoint get relevant endpoint for the region.
export function getS3Endpoint(region) {
  if (!isString(region)) {
    throw new TypeError(`Invalid region: ${region}`);
  }
  const endpoint = awsS3Endpoint[region];
  if (endpoint) {
    return endpoint;
  }
  return 's3.amazonaws.com';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc1N0cmluZyIsImF3c1MzRW5kcG9pbnQiLCJnZXRTM0VuZHBvaW50IiwicmVnaW9uIiwiVHlwZUVycm9yIiwiZW5kcG9pbnQiXSwic291cmNlcyI6WyJzMy1lbmRwb2ludHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIE1pbklPIEphdmFzY3JpcHQgTGlicmFyeSBmb3IgQW1hem9uIFMzIENvbXBhdGlibGUgQ2xvdWQgU3RvcmFnZSwgKEMpIDIwMTUsIDIwMTYgTWluSU8sIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuL2hlbHBlci50cydcblxuLy8gTGlzdCBvZiBjdXJyZW50bHkgc3VwcG9ydGVkIGVuZHBvaW50cy5cbmNvbnN0IGF3c1MzRW5kcG9pbnQgPSB7XG4gICd1cy1lYXN0LTEnOiAnczMuYW1hem9uYXdzLmNvbScsXG4gICd1cy1lYXN0LTInOiAnczMtdXMtZWFzdC0yLmFtYXpvbmF3cy5jb20nLFxuICAndXMtd2VzdC0xJzogJ3MzLXVzLXdlc3QtMS5hbWF6b25hd3MuY29tJyxcbiAgJ3VzLXdlc3QtMic6ICdzMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbScsXG4gICdjYS1jZW50cmFsLTEnOiAnczMuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb20nLFxuICAnZXUtd2VzdC0xJzogJ3MzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tJyxcbiAgJ2V1LXdlc3QtMic6ICdzMy1ldS13ZXN0LTIuYW1hem9uYXdzLmNvbScsXG4gICdzYS1lYXN0LTEnOiAnczMtc2EtZWFzdC0xLmFtYXpvbmF3cy5jb20nLFxuICAnZXUtY2VudHJhbC0xJzogJ3MzLWV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tJyxcbiAgJ2FwLXNvdXRoLTEnOiAnczMtYXAtc291dGgtMS5hbWF6b25hd3MuY29tJyxcbiAgJ2FwLXNvdXRoZWFzdC0xJzogJ3MzLWFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb20nLFxuICAnYXAtc291dGhlYXN0LTInOiAnczMtYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbScsXG4gICdhcC1zb3V0aGVhc3QtMyc6ICdzMy1hcC1zb3V0aGVhc3QtMy5hbWF6b25hd3MuY29tJyxcbiAgJ2FwLW5vcnRoZWFzdC0xJzogJ3MzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20nLFxuICAnY24tbm9ydGgtMSc6ICdzMy5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24nLFxuICAnYXAtZWFzdC0xJzogJ3MzLmFwLWVhc3QtMS5hbWF6b25hd3MuY29tJyxcbiAgJ2V1LW5vcnRoLTEnOiAnczMuZXUtbm9ydGgtMS5hbWF6b25hd3MuY29tJyxcbiAgLy8gQWRkIG5ldyBlbmRwb2ludHMgaGVyZS5cbn1cblxuZXhwb3J0IHR5cGUgUmVnaW9uID0ga2V5b2YgdHlwZW9mIGF3c1MzRW5kcG9pbnQgfCBzdHJpbmdcblxuLy8gZ2V0UzNFbmRwb2ludCBnZXQgcmVsZXZhbnQgZW5kcG9pbnQgZm9yIHRoZSByZWdpb24uXG5leHBvcnQgZnVuY3Rpb24gZ2V0UzNFbmRwb2ludChyZWdpb246IFJlZ2lvbik6IHN0cmluZyB7XG4gIGlmICghaXNTdHJpbmcocmVnaW9uKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgcmVnaW9uOiAke3JlZ2lvbn1gKVxuICB9XG5cbiAgY29uc3QgZW5kcG9pbnQgPSAoYXdzUzNFbmRwb2ludCBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KVtyZWdpb25dXG4gIGlmIChlbmRwb2ludCkge1xuICAgIHJldHVybiBlbmRwb2ludFxuICB9XG4gIHJldHVybiAnczMuYW1hem9uYXdzLmNvbSdcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNBLFFBQVEsUUFBUSxjQUFhOztBQUV0QztBQUNBLE1BQU1DLGFBQWEsR0FBRztFQUNwQixXQUFXLEVBQUUsa0JBQWtCO0VBQy9CLFdBQVcsRUFBRSw0QkFBNEI7RUFDekMsV0FBVyxFQUFFLDRCQUE0QjtFQUN6QyxXQUFXLEVBQUUsNEJBQTRCO0VBQ3pDLGNBQWMsRUFBRSwrQkFBK0I7RUFDL0MsV0FBVyxFQUFFLDRCQUE0QjtFQUN6QyxXQUFXLEVBQUUsNEJBQTRCO0VBQ3pDLFdBQVcsRUFBRSw0QkFBNEI7RUFDekMsY0FBYyxFQUFFLCtCQUErQjtFQUMvQyxZQUFZLEVBQUUsNkJBQTZCO0VBQzNDLGdCQUFnQixFQUFFLGlDQUFpQztFQUNuRCxnQkFBZ0IsRUFBRSxpQ0FBaUM7RUFDbkQsZ0JBQWdCLEVBQUUsaUNBQWlDO0VBQ25ELGdCQUFnQixFQUFFLGlDQUFpQztFQUNuRCxZQUFZLEVBQUUsZ0NBQWdDO0VBQzlDLFdBQVcsRUFBRSw0QkFBNEI7RUFDekMsWUFBWSxFQUFFO0VBQ2Q7QUFDRixDQUFDOztBQUlEO0FBQ0EsT0FBTyxTQUFTQyxhQUFhQSxDQUFDQyxNQUFjLEVBQVU7RUFDcEQsSUFBSSxDQUFDSCxRQUFRLENBQUNHLE1BQU0sQ0FBQyxFQUFFO0lBQ3JCLE1BQU0sSUFBSUMsU0FBUyxDQUFFLG1CQUFrQkQsTUFBTyxFQUFDLENBQUM7RUFDbEQ7RUFFQSxNQUFNRSxRQUFRLEdBQUlKLGFBQWEsQ0FBNEJFLE1BQU0sQ0FBQztFQUNsRSxJQUFJRSxRQUFRLEVBQUU7SUFDWixPQUFPQSxRQUFRO0VBQ2pCO0VBQ0EsT0FBTyxrQkFBa0I7QUFDM0IifQ==