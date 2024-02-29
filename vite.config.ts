import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
	// ...vite configures
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000,
	},
	plugins: [
		...VitePluginNode({
			appPath: "./src/app.ts",
			exportName: "app",

			async adapter({ app, req, res, next }) {
				const { method, url, headers, body: payload } = req;
				const a = await app();
				const hapiResp = await a.inject({ method, url, headers, payload });
				res.statusCode = hapiResp.statusCode;
				res.headers = hapiResp.headers;
				res.payload = hapiResp.payload;
				console.log(res);
				next();
			},
		}),
	],
	optimizeDeps: {
		// Vite does not work well with optionnal dependencies,
		// you can mark them as ignored for now
		// eg: for nestjs, exlude these optional dependencies:
		// exclude: [
		//   '@nestjs/microservices',
		//   '@nestjs/websockets',
		//   'cache-manager',
		//   'class-transformer',
		//   'class-validator',
		//   'fastify-swagger',
		// ],
	},
});
