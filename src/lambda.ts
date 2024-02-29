/**
 * Lambda code for running in AWS with API Gateway.
 * Since there's only a single endpoint, we don't need to use the Hapi router here.
 */

import { Handler } from "aws-lambda";
import { DivvyBikesClient } from "./client";
import { DIVVY_BIKE_STATIONS_API_URL } from "./config";
import { authHeaderValid } from "./auth";

function resp(code: number, body: object) {
	return { statusCode: code, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
	const client = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL);
	const result = await client.getSmallStations();

	const { valid } = authHeaderValid(event.headers?.Authorization);
	if (!valid) {
		return resp(401, { error: "Unauthorized" });
	}

	if (!result.success) {
		console.error(result.error);
		return resp(500, { error: "Internal Server Error" });
	}

	return resp(200, result.stations);
};
