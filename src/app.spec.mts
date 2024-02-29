import { describe, expect, it } from "vitest";
import { server } from "./app.mts";

describe("server", () => {
	it("renders hello world properly", async () => {
		const res = await server.inject({ method: "GET", url: "/" });
		expect(res.statusCode).toBe(200);
		expect(res.payload).toBe("Hello, world!");
	});
});
