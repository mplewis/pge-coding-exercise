import { describe, expect, it } from "vitest";
import { buildServer } from "./app.mts";
import { IDivvyBikesClient } from "./client.mts";

const dummyStation = {
	rental_uris: { android: "a", ios: "i" },
	short_name: "short",
	has_kiosk: true,
	external_id: "ext",
	rental_methods: ["x", "y"],
	station_type: "type",
	electric_bike_surcharge_waiver: true,
	name: "name",
	eightd_has_key_dispenser: true,
	capacity: 42,
	station_id: "id",
	eightd_station_services: ["s1", "s2"],
	lon: 1.2,
	lat: 3.4,
};

const fakeClient: IDivvyBikesClient = {
	getAllStations: () =>
		Promise.resolve({
			success: true,
			stations: [dummyStation, dummyStation, dummyStation],
		}),
	getSmallStations: () =>
		Promise.resolve({
			success: true,
			stations: [dummyStation, dummyStation],
		}),
};

describe("server", () => {
	const server = buildServer(fakeClient);

	it("renders hello world properly", async () => {
		const res = await server.inject({ method: "GET", url: "/" });
		expect(res.statusCode).toBe(200);
		expect(res.payload).toBe("Hello, world!");
	});

	it("renders stations properly", async () => {
		const res = await server.inject({ method: "GET", url: "/stations" });
		expect(res.statusCode).toBe(200);
		const data = JSON.parse(res.payload);
		expect(data.length).toBe(2);
	});
});
