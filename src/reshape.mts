import { Station } from "./client.mts";

/** A minimal subset of the info for a single Divvy Bikes station. */
export type StationMinimal = Omit<
	Station,
	"rental_methods" | "rental_uris" | "external_id" | "station_id"
> & {
	externalId: string;
	stationId: string;
};

export function minimizeStation(s: Station): StationMinimal {
	const { rental_methods, rental_uris, external_id, station_id, ...rest } = s;
	return { ...rest, externalId: external_id, stationId: station_id };
}
