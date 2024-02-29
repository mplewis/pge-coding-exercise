import { describe, expect, it } from "vitest";
import { minimizeStation } from "./reshape.mts";
import { Station } from "./client.mts";

describe("minimizeStation", () => {
	it("reshapes station data properly", () => {
		const s: Station = {
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
		expect(minimizeStation(s)).toMatchInlineSnapshot(`
			{
			  "capacity": 42,
			  "eightd_has_key_dispenser": true,
			  "eightd_station_services": [
			    "s1",
			    "s2",
			  ],
			  "electric_bike_surcharge_waiver": true,
			  "externalId": "ext",
			  "has_kiosk": true,
			  "lat": 3.4,
			  "lon": 1.2,
			  "name": "name",
			  "short_name": "short",
			  "stationId": "id",
			  "station_type": "type",
			}
		`);
	});
});
