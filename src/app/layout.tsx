import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

const sonko = localFont({
  src: [
    { path: "../../public/fonts/Sonko-Thin.ttf", weight: "100" },
    { path: "../../public/fonts/Sonko-Light.ttf", weight: "300" },
    { path: "../../public/fonts/Sonko-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Sonko-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Sonko-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/Sonko-Black.ttf", weight: "900" },
  ],
  variable: "--font-sonko",
  display: "swap",
});

const sonkoBlack = localFont({
  src: "../../public/fonts/Sonko-Black.ttf",
  weight: "900",
  variable: "--font-sonko-black",
  display: "swap",
});

const sonkoBold = localFont({
  src: "../../public/fonts/Sonko-Bold.ttf",
  weight: "700",
  variable: "--font-sonko-bold",
  display: "swap",
});

const sonkoMedium = localFont({
  src: "../../public/fonts/Sonko-Medium.ttf",
  weight: "500",
  variable: "--font-sonko-medium",
  display: "swap",
});

const sonkoLight = localFont({
  src: "../../public/fonts/Sonko-Light.ttf",
  weight: "300",
  variable: "--font-sonko-light",
  display: "swap",
});

const sonkoThin = localFont({
  src: "../../public/fonts/Sonko-Thin.ttf",
  weight: "100",
  variable: "--font-sonko-thin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YourTrust — Trust & Transparency in Informal Finance",
  description:
    "Transform informal lending between friends and family into a secure, trackable experience with AI-powered mediation, trust scores, and digital agreements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sonko.variable} ${sonkoBlack.variable} ${sonkoBold.variable} ${sonkoMedium.variable} ${sonkoLight.variable} ${sonkoThin.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
