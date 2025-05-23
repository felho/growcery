import "server-only";
import { ALLOWED_DOMAINS } from "./allowed-domains";

// Re-export for backward compatibility
export { ALLOWED_DOMAINS };

/**
 * Checks if the provided email domain is in the allowed domains list
 * @param email The email address to validate
 * @returns True if the domain is allowed, false otherwise
 */
export function isAllowedEmailDomain(email: string): boolean {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;

    return ALLOWED_DOMAINS.includes(domain);
  } catch (error) {
    return false;
  }
}
