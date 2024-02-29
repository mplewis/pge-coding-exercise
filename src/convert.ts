import tmp from "tmp";
import * as csvWriter from "csv-writer";
import { Station } from "./client";

// Design a map type that maps every key in Station to a string value
const headers: { id: keyof Station; title: string }[] = [
	{ id: "name", title: "name" },
	{ id: "short_name", title: "short_name" },
	{ id: "stationId", title: "stationId" },
	{ id: "externalId", title: "externalId" },
	{ id: "station_type", title: "station_type" },
	{ id: "lat", title: "lat" },
	{ id: "lon", title: "lon" },
	{ id: "capacity", title: "capacity" },
	{ id: "has_kiosk", title: "has_kiosk" },
	{ id: "eightd_has_key_dispenser", title: "eightd_has_key_dispenser" },
	{
		id: "electric_bike_surcharge_waiver",
		title: "electric_bike_surcharge_waiver",
	},
	{ id: "eightd_station_services", title: "eightd_station_services" },
];

export async function stationsToCSV(
	stations: Station[],
): Promise<
	{ success: true; path: string } | { success: false; error: string }
> {
	// Don't worry about cleaning up the tempfile. It will be destroyed when the lambda exits.
	const tempfile = tmp.tmpNameSync();

	try {
		const writer = csvWriter.createObjectCsvWriter({
			path: tempfile,
			header: headers,
		});
		await writer.writeRecords(stations);
	} catch (error: any) {
		return { success: false, error: error.toString() };
	}

	return { success: true, path: tempfile };
}
