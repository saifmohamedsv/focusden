import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const lora = Lora({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "FocusDen — Focus, Flow, Feel Good",
  description:
    "A cozy focus platform with Pomodoro timer, ambient sounds, and a companion to keep you company while you work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${lora.variable} ${dmSans.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
