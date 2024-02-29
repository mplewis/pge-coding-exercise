import * as Hapi from "@hapi/hapi";
import { DivvyBikesClient, IDivvyBikesClient } from "./client";

const DIVVY_BIKE_STATIONS_API_URL =
	"https://gbfs.divvybikes.com/gbfs/en/station_information.json";

export const buildServer = (
	client: IDivvyBikesClient = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL),
) => {
	const server = Hapi.server({
		host: process.env.HOST || "localhost",
		port: process.env.PORT || 3000,
	});

	server.route({
		method: "GET",
		path: "/stations",
		handler: async (_req, h) => {
			const result = await client.getSmallStations();
			if (!result.success) {
				console.error(result.error); // TODO: improved error logging
				// user doesn't need to know specifics at this time
				return h.response("500 Internal Server Error").code(500);
			}
			return result.stations;
		},
	});

	return server;
};
