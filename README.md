# PG&E Coding Exercise

This implements an AWS Lambda function which reads from the [Divvy Bikes Station Information](https://gbfs.divvybikes.com/gbfs/en/station_information.json) API, processes the data for all stations with < 12 capacity into a CSV, and stores it in a public S3 bucket.

## Usage

### Install dependencies

This project uses pnpm, so install it before installing dependencies:

```bash
npm install -g pnpm
pnpm install
```

### Run tests

This project uses Vitest to run tests ending in `.spec.ts`:

```bash
pnpm test
```

### Start the dev server

The Hapi server's entrypoint is [src/serve.ts](src/serve.ts). This server is for demo purposes only and doesn't build the CSV report or upload to S3. Run this locally on port 3000 with hot reloading:

```bash
pnpm dev
```

Get the list of stations using curl:

```bash
curl -H "Authorization: Bearer dummy-token-for-testing" \
	http://localhost:3000
```

### Run in a Docker container

Use the package.json scripts to build and run the Hapi server in a Docker container:

```bash
pnpm docker-build
pnpm docker-run
```

Send a request to the Docker container:

```bash
curl -H "Authorization: Bearer dummy-token-for-testing" \
	http://localhost:3000
```

### Deploy the Lambda function

The Lambda function's entrypoint is [src/lambda.ts](src/lambda.ts). Deployment is performed by AWS CDK and defined in [deploy/lib/deploy-stack.ts](deploy/lib/deploy-stack.ts):

```bash
bin/bootstrap  									 # only necessary before your first deploy run
bin/deploy											 # create the infrastructure and deploy the Lambda code
(cd deploy && pnpm cdk destroy)  # if you want to destroy the stack and its resources
```

Deploying this function will print the URL for your API Gateway endpoint:

```bash
Outputs:
DivvyBikeStations.DivvyBikeStationsAPIEndpointCB164D8F = https://mnor5f4dxj.execute-api.us-west-2.amazonaws.com/prod/
```

You can test my demo instance of this Lambda function using curl:

```bash
curl -H "Authorization: Bearer dummy-token-for-testing" \
	https://mnor5f4dxj.execute-api.us-west-2.amazonaws.com/prod/
```

On success, this function returns a JSON response pointing to the CSV report in the public S3 bucket:

```json
{
	"csvReportURL": "https://divvy-bikes-stations-data-352053662162.s3.amazonaws.com/stations-1709197898.csv"
}
```

## Environment Variables

The behavior of the server can be customized using environment variables, defined in [src/config.ts](src/config.ts):

| Name                          | Type       | Description                                                     | Default                                                        |
| ----------------------------- | ---------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `DIVVY_BIKE_STATIONS_API_URL` | `string`   | The API URL for fetching information about Divvy Bike stations  | `https://gbfs.divvybikes.com/gbfs/en/station_information.json` |
| `HOST`                        | `string`   | The host on which the server runs                               | `localhost`                                                    |
| `PORT`                        | `number`   | The port on which the server listens                            | `3000`                                                         |
| `AUTH_TOKENS`                 | `string[]` | The valid authentication tokens for the server, comma-separated | `dummy-token-for-testing,another-dummy-token`                  |
