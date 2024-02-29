import { describe, expect, it } from "vitest";
import { authHeaderValid } from "./auth";

describe("authHeaderValid", () => {
	it("validates tokens properly", () => {
		expect(authHeaderValid("Bearer dummy-token-for-testing")).toEqual({
			valid: true,
			token: "dummy-token-for-testing",
		});
		expect(authHeaderValid("Bearer bad-token")).toEqual({ valid: false });
	});
});
