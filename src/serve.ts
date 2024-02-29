/** Start the Hapi server. */

import { buildServer } from "./hapi";

(async () => {
	const server = buildServer();
	await server.start();
	console.log("Server running on %s", server.info.uri);
})();
