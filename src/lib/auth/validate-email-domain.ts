import "server-only";

// List of allowed email domains
export const ALLOWED_DOMAINS = [
  // Add your allowed domains here, for example:
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "company.com",
  // Add more as needed
];

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
