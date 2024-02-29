/** Hapi server code for running locally or in Docker. */

import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { DivvyBikesClient, IDivvyBikesClient } from "./client";
import { DIVVY_BIKE_STATIONS_API_URL, HOST, PORT } from "./config";
import { authHeaderValid } from "./auth";

/** Build a new Hapi server, optionally using the given client. */
export const buildServer = (
	client: IDivvyBikesClient = new DivvyBikesClient(DIVVY_BIKE_STATIONS_API_URL),
) => {
	const server = Hapi.server({ host: HOST, port: PORT });

	// Configure token authentication
	server.auth.scheme("tokenScheme", () => ({
		authenticate(req, h) {
			const result = authHeaderValid(req.headers.authorization);
			if (!result.valid) {
				throw Boom.unauthorized();
			}
			return h.authenticated({ credentials: { token: result.token } });
		},
	}));
	server.auth.strategy("tokenStrategy", "tokenScheme");
	server.auth.default("tokenStrategy");

	// Mount routes
	server.route({
		method: "GET",
		path: "/stations",
		handler: async (_req, h) => {
			const result = await client.getSmallStations();
			if (!result.success) {
				console.error(result.error); // TODO: improved error logging
				// user doesn't need to know error specifics at this time
				return h.response("500 Internal Server Error").code(500);
			}
			return result.stations;
		},
	});

	return server;
};
