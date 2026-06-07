import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathGenius — ZAP Vorbereitung",
  description:
    "Übe Mathematikaufgaben für die Zürcher Gymnasialaufnahmeprüfung (ZAP). Langgymi und Kurzgymi Vorbereitung mit echten Prüfungsaufgaben.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="page-shell">
          <Header />
          <main className="page-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
