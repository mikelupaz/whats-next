import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import SnackbarContext from "./context/SnackbarContext";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Next Messager",
  description: "Next Messager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthContext>
          <SnackbarContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
