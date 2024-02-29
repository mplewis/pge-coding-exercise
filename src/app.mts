import Hapi from "@hapi/hapi";

export const server = Hapi.server({
	host: "localhost",
	port: 3000,
});

server.route({
	method: "GET",
	path: "/",
	handler: (_request, _h) => {
		return "Hello, world!";
	},
});
