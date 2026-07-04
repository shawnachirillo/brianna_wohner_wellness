import type { Metadata } from "next";
import { Noto_Serif_Display, Open_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-noto-serif-display",
  weight: ["400", "500", "700", "800"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "600", "700"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Brianna Wohner Wellness",
  description: "Yoga, nutrition, and wellness coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${notoSerifDisplay.variable} ${openSans.variable} ${dancingScript.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}