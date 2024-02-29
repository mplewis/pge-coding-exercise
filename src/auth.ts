import { AUTH_TOKENS } from "./config";

export function authHeaderValid(
	authHeader: string | undefined,
): { valid: true; token: string } | { valid: false } {
	const token = authHeader?.match(/Bearer (.+)/)?.[1];
	if (!token) return { valid: false };
	if (!AUTH_TOKENS.includes(token)) return { valid: false };
	return { valid: true, token };
}
