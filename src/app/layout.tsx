import type { Metadata } from "next";
import "@/styles/globals.css";
import "./globals.css";
import Header from "@/components/portfolio/Header";
import Footer from "@/components/portfolio/Footer";
import AccessStatusBanner from "@/components/rbac/AccessStatusBanner";

export const metadata: Metadata = {
  title: "Dr. Logishoren — Researcher & Professor Portfolio",
  description:
    "Faculty portfolio website for Dr. Logishoren — Professor, Researcher, and Academic. Explore research papers, publications, blog posts, and academic achievements.",
  icons: {
    icon: "/assets/images/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Vendor CSS */}
        <link rel="stylesheet" href="/assets/css/vendor/fontawesome.css" />
        <link rel="stylesheet" href="/assets/css/plugins/swiper.css" />
        <link rel="stylesheet" href="/assets/css/plugins/odometer.css" />
        <link rel="stylesheet" href="/assets/css/vendor/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/vendor/bootstrap.min.css" />
        {/* Template CSS */}
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className="tmp-white-version">
        <AccessStatusBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
