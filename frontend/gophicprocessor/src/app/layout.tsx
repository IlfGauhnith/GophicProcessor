import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Theme } from "@radix-ui/themes";
import GlobalFetchInterceptor from "@/components/GlobalFetchInterceptor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gophic Processor",
  description: "Gopher process your image!",
};

// Export viewport separately.
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>
          <GlobalFetchInterceptor>
            {children}
          </GlobalFetchInterceptor>
        </Theme>
      </body>
    </html>
  );
}
