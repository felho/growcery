import { NextRequest, NextResponse } from "next/server";

// Simplified list of allowed domains
const ALLOWED_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "company.com",
];

// Simple validation function
function isAllowedEmailDomain(email: string): boolean {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    
    return ALLOWED_DOMAINS.includes(domain);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Simple domain validation
    const isAllowed = isAllowedEmailDomain(email);

    if (!isAllowed) {
      return NextResponse.json({ error: "Email domain not allowed" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error validating email domain:", error);
    return NextResponse.json(
      { error: "An error occurred while validating the email" },
      { status: 500 }
    );
  }
}
