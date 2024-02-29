import { describe, expect, it } from "vitest";
import { stationsToCSV } from "./convert";
import { readFileSync, unlinkSync } from "fs";
import { Station } from "./client";

const dummyStation: Station = {
	short_name: "Some Short Name",
	has_kiosk: true,
	externalId: "SOME_EXTERNAL_ID",
	station_type: "Some Station Type",
	electric_bike_surcharge_waiver: true,
	name: "Some Station Name",
	eightd_has_key_dispenser: true,
	capacity: 42,
	stationId: "SOME_STATION_ID",
	eightd_station_services: ["Service 1", "Service 2"],
	lon: 1.2,
	lat: 3.4,
};

describe("stationsToCSV", () => {
	it("converts a list of stations to CSV", async () => {
		const stations = [dummyStation, dummyStation];

		const result = await stationsToCSV(stations);

		if (!result.success) console.error(result.error);
		expect(result.success).toBe(true);
		if (!result.success) return;

		try {
			const contents = readFileSync(result.path, "utf8");
			expect(contents).toMatchInlineSnapshot(`
			"Name,Short name,Station ID,External ID,Station type,Latitude,Longitude,Capacity,Has kiosk?,Has key dispenser?,Has electric bike surcharge waiver?,Station services
			Some Station Name,Some Short Name,SOME_STATION_ID,SOME_EXTERNAL_ID,Some Station Type,3.4,1.2,42,true,true,true,"Service 1,Service 2"
			Some Station Name,Some Short Name,SOME_STATION_ID,SOME_EXTERNAL_ID,Some Station Type,3.4,1.2,42,true,true,true,"Service 1,Service 2"
			"
		`);
		} finally {
			unlinkSync(result.path);
		}
	});
});
