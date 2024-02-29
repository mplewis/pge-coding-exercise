/** Constants used to configure this server. */

/** The URL of the Divvy bike stations API endpoint. */
export const DIVVY_BIKE_STATIONS_API_URL =
	process.env.DIVVY_BIKE_STATIONS_API_URL ||
	"https://gbfs.divvybikes.com/gbfs/en/station_information.json";
/** The interface on which the server will listen. */
export const HOST = process.env.HOST || "localhost";
/** The port on which the server will listen. */
export const PORT = process.env.PORT || 3000;
