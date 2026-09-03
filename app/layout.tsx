import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "./components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapost.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "LocaPost — Write, Refine & Share on Your Terms",
    template: "%s | LocaPost",
  },

  description:
    "LocaPost is a private-first article platform for writing, refining, and sharing long-form content through simple permanent links.",

  applicationName: "LocaPost",

  openGraph: {
    title: "LocaPost — Write, Refine & Share on Your Terms",
    description:
      "LocaPost is a private-first article platform for writing, refining, and sharing long-form content through simple permanent links.",
    url: "/",
    siteName: "LocaPost",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "LocaPost — Write, Refine & Share on Your Terms",
    description:
      "LocaPost is a private-first article platform for writing, refining, and sharing long-form content through simple permanent links.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col pt-[env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)]">
        <div className="flex flex-1 flex-col">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}