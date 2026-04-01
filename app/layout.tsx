import type { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "La Prospect",
  description: "Plataforma de fidelización multitenant para restaurantes y negocios."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="es">
      <body>{children}</body>
    </html>
  );
}
