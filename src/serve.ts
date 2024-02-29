import { buildServer } from "./app";

(async () => {
	const server = buildServer();
	await server.start();
	console.log("Server running on %s", server.info.uri);
})();
