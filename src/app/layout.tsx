import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { EnsureUserSync } from "~/lib/auth/ensure-user-sync";
import MainLayout from "./_components/main-layout";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "GROWery",
  description: "GROW people to their fullest potential",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body className="dark overscroll-none">
          <SignedOut>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </SignedOut>

          <SignedIn>
            <EnsureUserSync />
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
