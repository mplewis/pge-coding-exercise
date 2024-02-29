import { z } from "zod";

/** A schema for the info for a single Divvy Bikes station. */
const stationSchema = z.object({
	rental_uris: z.object({
		android: z.string(),
		ios: z.string(),
	}),
	short_name: z.string().optional(),
	has_kiosk: z.boolean(),
	external_id: z.string(),
	rental_methods: z.array(z.string()).optional(),
	station_type: z.string(),
	electric_bike_surcharge_waiver: z.boolean(),
	name: z.string(),
	eightd_has_key_dispenser: z.boolean(),
	capacity: z.number(),
	station_id: z.string(),
	eightd_station_services: z.array(z.string()),
	lon: z.number(),
	lat: z.number(),
});
/** The info for a single Divvy Bikes station, as received from the API. */
export type RawStation = z.infer<typeof stationSchema>;

/** The info for a single Divvy Bikes station. */
export type Station = Omit<
	RawStation,
	"rental_methods" | "rental_uris" | "external_id" | "station_id"
> & {
	externalId: string;
	stationId: string;
};

/** A schema for the full station info response from Divvy Bikes. */
const stationInfoRespSchema = z.object({
	data: z.object({ stations: z.array(stationSchema) }),
	last_updated: z.number(),
	ttl: z.number(),
	version: z.string(),
});
/** The full station info response from Divvy Bikes. */
export type StationInfoResp = z.infer<typeof stationInfoRespSchema>;

/** The interface for a Divvy Bikes client. */
export interface IDivvyBikesClient {
	getSmallStations: () => Promise<
		{ success: true; stations: Station[] } | { success: false; error: string }
	>;
}

/** Minimize a station's data and rewrite the IDs to use camelcase. */
export function minimizeStation(s: RawStation): Station {
	const { rental_methods, rental_uris, external_id, station_id, ...rest } = s;
	return { ...rest, externalId: external_id, stationId: station_id };
}

/** An API client for Divvy Bikes. */
export class DivvyBikesClient implements IDivvyBikesClient {
	constructor(private stationInfoJSONURL: string) {}

	/** Get all bike stations with capacity < 12. */
	async getSmallStations(): Promise<
		{ success: true; stations: Station[] } | { success: false; error: string }
	> {
		let resp: Response;
		try {
			resp = await fetch(this.stationInfoJSONURL);
		} catch (e: any) {
			return { success: false, error: e.toString() };
		}

		const data = await resp.json();
		const result = await stationInfoRespSchema.safeParseAsync(data);
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}

		const stations = result.data.data.stations
			.filter((s) => s.capacity < 12)
			.map(minimizeStation);
		return { success: true, stations };
	}
}
