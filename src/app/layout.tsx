import type { Metadata } from "next";
import AccessStatusBanner from "@/components/rbac/AccessStatusBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prof. Logishoren | Faculty Portfolio",
  description:
    "Portfolio website for Prof. Logishoren — research, publications, and professional profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AccessStatusBanner />
        {children}
      </body>
    </html>
  );
}

