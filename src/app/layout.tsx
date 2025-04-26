import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";

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
            <main className="flex h-full w-full flex-col">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
