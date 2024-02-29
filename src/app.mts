import Hapi from "@hapi/hapi";
import { DivvyBikesClient } from "./client.mts";

const DIVVY_BIKE_STATIONS_API_URL =
	"https://gbfs.divvybikes.com/gbfs/en/station_information.json";

export const server = Hapi.server({
	host: "localhost",
	port: 3000,
});

const client = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL);

server.route({
	method: "GET",
	path: "/",
	handler: (_request, _h) => {
		return "Hello, world!";
	},
});

server.route({
	method: "GET",
	path: "/stations/all",
	handler: async (_req, h) => {
		const result = await client.getAllStations();
		if (!result.success) {
			// user doesn't need to know specifics at this time
			return h.response("500 Internal Server Error").code(500);
		}
		return result.stations;
	},
});

server.route({
	method: "GET",
	path: "/stations/small",
	handler: async (_req, h) => {
		const result = await client.getSmallStations();
		if (!result.success) {
			// user doesn't need to know specifics at this time
			return h.response("500 Internal Server Error").code(500);
		}
		return result.stations;
	},
});
