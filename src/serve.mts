import { buildServer } from "./app.mts";

const server = buildServer();
await server.start();
console.log("Server running on %s", server.info.uri);
