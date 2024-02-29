import { server } from "./app.mts";

await server.start();
console.log("Server running on %s", server.info.uri);
