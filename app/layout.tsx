import React from "react"
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SmoothScrollProvider from '@/providers/SmoothScrollProvider'

const sonko = localFont({
  src: [
    { path: "../public/fonts/Sonko-Thin.ttf", weight: "100" },
    { path: "../public/fonts/Sonko-Light.ttf", weight: "300" },
    { path: "../public/fonts/Sonko-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Sonko-Medium.ttf", weight: "500" },
    { path: "../public/fonts/Sonko-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Sonko-Black.ttf", weight: "900" },
  ],
  variable: "--font-sonko",
  display: "swap",
});

const sonkoBlack = localFont({
  src: "../public/fonts/Sonko-Black.ttf",
  weight: "900",
  variable: "--font-sonko-black",
  display: "swap",
});

const sonkoBold = localFont({
  src: "../public/fonts/Sonko-Bold.ttf",
  weight: "700",
  variable: "--font-sonko-bold",
  display: "swap",
});

const sonkoMedium = localFont({
  src: "../public/fonts/Sonko-Medium.ttf",
  weight: "500",
  variable: "--font-sonko-medium",
  display: "swap",
});

const sonkoLight = localFont({
  src: "../public/fonts/Sonko-Light.ttf",
  weight: "300",
  variable: "--font-sonko-light",
  display: "swap",
});

const sonkoThin = localFont({
  src: "../public/fonts/Sonko-Thin.ttf",
  weight: "100",
  variable: "--font-sonko-thin",
  display: "swap",
});

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'YourTrust - Trust & Transparency in Informal Finance',
  description: 'Manage informal lending between friends and family with AI mediation, trust scores, and legal-free agreements.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sonko.variable} ${sonkoBlack.variable} ${sonkoBold.variable} ${sonkoMedium.variable} ${sonkoLight.variable} ${sonkoThin.variable}`}>
      <body className={`font-sans antialiased`}>
        <SmoothScrollProvider>
          {children}
          <Analytics />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
