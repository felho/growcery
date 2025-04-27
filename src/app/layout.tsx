import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { SyncUser } from "./_components/syncuser";

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
        <body className="dark">
          <div className="h-screen w-screen">
            <TopNav />

            <main className="flex h-full w-full flex-col">
              <SignedOut>
                <div className="h-full w-full p-4 text-center text-3xl">
                  Please sign in above
                </div>
              </SignedOut>

              <SignedIn>
                <SyncUser />
                {children}
              </SignedIn>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
