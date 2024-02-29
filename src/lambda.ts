/**
 * Lambda code for running in AWS with API Gateway.
 * Since there's only a single endpoint, we don't need to use the Hapi router here.
 */

import { Handler } from "aws-lambda";
import { DivvyBikesClient } from "./client";
import { DIVVY_BIKE_STATIONS_API_URL } from "./config";

export const handler: Handler = async () => {
	const client = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL);
	const result = await client.getSmallStations();
	if (!result.success) {
		console.error(result.error);
		return { statusCode: 500, body: "Internal Server Error" };
	}
	return { statusCode: 200, body: JSON.stringify(result.stations) };
};
