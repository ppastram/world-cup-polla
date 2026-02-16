import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Polla Mundialista 2026",
  description:
    "Predice los resultados del Mundial 2026 y compite con tus amigos",
  openGraph: {
    title: "Polla Mundialista 2026",
    description:
      "Predice los resultados del Mundial 2026 y compite con tus amigos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} font-sans antialiased bg-wc-darker text-foreground`}>
        {children}
      </body>
    </html>
  );
}
