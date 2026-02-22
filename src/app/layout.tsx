import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { heIL } from "@clerk/localizations";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "רשימת תפילה",
  description: "ניהול רשימות תפילה לרפואת חולים ופצועים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={heIL}>
      <html lang="he" dir="rtl">
        <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
