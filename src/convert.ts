import tmp from "tmp";
import fs from "fs";
import * as csvWriter from "csv-writer";
import { Station } from "./client";

// Design a map type that maps every key in Station to a string value
const headers: { id: keyof Station; title: string }[] = [
	{ id: "name", title: "Name" },
	{ id: "short_name", title: "Short name" },
	{ id: "stationId", title: "Station ID" },
	{ id: "externalId", title: "External ID" },
	{ id: "station_type", title: "Station type" },
	{ id: "lat", title: "Latitude" },
	{ id: "lon", title: "Longitude" },
	{ id: "capacity", title: "Capacity" },
	{ id: "has_kiosk", title: "Has kiosk?" },
	{ id: "eightd_has_key_dispenser", title: "Has key dispenser?" },
	{
		id: "electric_bike_surcharge_waiver",
		title: "Has electric bike surcharge waiver?",
	},
	{ id: "eightd_station_services", title: "Station services" },
];

type csvCallback = (
	result: { success: true; path: string } | { success: false; error: string },
) => Promise<void>;

export async function stationsToCSV(stations: Station[], cb: csvCallback) {
	async function writeAndCallback() {
		try {
			const writer = csvWriter.createObjectCsvWriter({
				path: tempfile,
				header: headers,
			});

			console.log(stations);
			await writer.writeRecords(stations);
		} catch (error: any) {
			await cb({ success: false, error: error.toString() });
		}
		await cb({ success: true, path: tempfile });
	}

	const tempfile = tmp.tmpNameSync();
	try {
		await writeAndCallback();
	} finally {
		try {
			fs.unlinkSync(tempfile);
		} catch (e) {
			// ignore - it's already gone
		}
	}
}
