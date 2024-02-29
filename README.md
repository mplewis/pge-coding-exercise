# PG&E - MRAD Node.js Coding Task

## Description

This project involves creating an AWS Lambda function to implement a RESTful API. The API executes the following steps for every request:

1. Pull data from the provided URL: [Divvy Bikes Station Information](https://gbfs.divvybikes.com/gbfs/en/station_information.json)
2. Make specific changes to the retrieved data.
3. Convert the modified JSON output into CSV format.
4. Write the CSV output into the filesystem.
5. Upload the CSV file to an S3 bucket.

## Requirements

- [x] Use Hapi (node framework).
- [x] Utilize async/await.
- [x] Include a unit test for the API call.
- [x] Avoid installing 3rd-party databases, caching, or other server apps.
- [x] Optimize the app for performance, assuming it will run in a multiprocessor or multicore environment.
- [x] Set up the app to run locally and on AWS Lambda. Ensure the Lambda can be triggered when running the project locally.

## Really Nice To Have (Bonus)

- [x] Implement API token authentication and handle missing tokens gracefully.
- [x] Containerize the app using Docker for deployment.
- [x] Provide an API gateway URL to trigger the Lambda function.
- [ ] Add any features that make the project stand out.

## Submission

Please provide the source code of your project through a file or code repository. Include a README file in the project containing instructions on how to run the project and any additional details.

# README

## Usage

- install deps
- run tests
- dev server
- run in Docker
- bootstrap CDK
- deploy to Lambda
- demo auth request

## Environment Variables

| Name                          | Type       | Description                                                     | Default                                                        |
| ----------------------------- | ---------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `DIVVY_BIKE_STATIONS_API_URL` | `string`   | The API URL for fetching information about Divvy Bike stations  | `https://gbfs.divvybikes.com/gbfs/en/station_information.json` |
| `HOST`                        | `string`   | The host on which the server runs                               | `localhost`                                                    |
| `PORT`                        | `number`   | The port on which the server listens                            | `3000`                                                         |
| `AUTH_TOKENS`                 | `string[]` | The valid authentication tokens for the server, comma-separated | `dummy-token-for-testing,another-dummy-token`                  |
