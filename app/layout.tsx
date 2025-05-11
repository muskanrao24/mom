import type { Metadata } from "next";
import { Courgette, Open_Sans, The_Girl_Next_Door } from "next/font/google";
import "./globals.css";

const courgette = Courgette({
  variable: "--font-courgette",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theGirlNextDoor = The_Girl_Next_Door({
  variable: "--font-the-girl-next-door",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ma",
  description: "To the one and only, my mom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${courgette.variable} ${openSans.variable} ${theGirlNextDoor.variable}`}
        style={{
          fontFamily: "var(--font-the-girl-next-door)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
