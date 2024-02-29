/**
 * Lambda code for running in AWS with API Gateway.
 * Since there's only a single endpoint, we don't need to use the Hapi router here.
 */

import { Handler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DivvyBikesClient } from "./client";
import { DIVVY_BIKE_STATIONS_API_URL, S3_BUCKET } from "./config";
import { authHeaderValid } from "./auth";
import { stationsToCSV } from "./convert";
import { createReadStream } from "fs";

/** Return the current Unix epoch time in seconds. */
function unixEpoch() {
	return Math.floor(Date.now() / 1000);
}

/**
 * Put CSV data from a given filesystem path into the given bucket,
 * generating a reasonably unique key based on the current time.
 */
async function putCSVData(
	bucket: string,
	path: string,
): Promise<{ success: true; key: string } | { success: false; error: string }> {
	const s3Client = new S3Client();
	const putObjectParams = {
		Bucket: bucket,
		Key: `stations-${unixEpoch()}.csv`,
		Body: createReadStream(path),
	};

	try {
		await s3Client.send(new PutObjectCommand(putObjectParams));
	} catch (e: any) {
		console.error(e);
		return { success: false, error: e.toString() };
	}
	return { success: true, key: putObjectParams.Key };
}

/** Write a response with the given status code and JSON body. */
function resp(code: number, body: object) {
	return { statusCode: code, body: JSON.stringify(body) };
}

/** Log an unexpected error and return a generic error to the user. */
function ise(error: string) {
	console.error(error);
	return resp(500, { error: "Internal Server Error" });
}

/**
 * Generate a stations report, put it into the public S3 bucket,
 * and return the public URL of the report.
 */
export const handler: Handler = async (event) => {
	const { valid } = authHeaderValid(event.headers?.Authorization);
	if (!valid) {
		return resp(401, { error: "Unauthorized" });
	}

	const bucket = S3_BUCKET;
	if (!bucket) {
		console.error("S3_BUCKET not set");
		return resp(500, { error: "Internal Server Error" });
	}

	const client = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL);
	const apiResult = await client.getSmallStations();
	if (!apiResult.success) return ise(apiResult.error);

	const csvResult = await stationsToCSV(apiResult.stations);
	if (!csvResult.success) return ise(csvResult.error);

	const putResult = await putCSVData(bucket, csvResult.path);
	if (!putResult.success) return ise(putResult.error);

	const publicURL = `https://${bucket}.s3.amazonaws.com/${putResult.key}`;
	return resp(200, { csvReportURL: publicURL });
};
