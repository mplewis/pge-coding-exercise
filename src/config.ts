/** Constants used to configure this server. */

/** The URL of the Divvy bike stations API endpoint. */
export const DIVVY_BIKE_STATIONS_API_URL =
	process.env.DIVVY_BIKE_STATIONS_API_URL ||
	"https://gbfs.divvybikes.com/gbfs/en/station_information.json";

/** The interface on which the server will listen. */
export const HOST = process.env.HOST || "localhost";

/** The port on which the server will listen. */
export const PORT = process.env.PORT || 3000;

/**
 * Auth tokens, comma-separated, which allow access to this API via `Authentication: Bearer` header
 * This is a basic, insecure implementation - a prod-ready impl wouldn't boot with dummy tokens.
 */
export const AUTH_TOKENS = (
	process.env.AUTH_TOKENS || "dummy-token-for-testing,another-dummy-token"
).split(",");

/** Only used by the Lambda function, this value is populated by the CDK stack. */
export const S3_BUCKET = process.env.S3_BUCKET || null;
