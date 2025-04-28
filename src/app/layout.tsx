import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { SyncUser } from "./_components/sync-user";
import MainLayout from "./_components/main-layout";
import SignInLayout from "./_components/sign-in-layout";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "GROWcery",
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
            <SignInLayout />
          </SignedOut>

          <SignedIn>
            <SyncUser />
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
