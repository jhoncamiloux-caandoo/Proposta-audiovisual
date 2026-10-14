import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./proposal.css";

const dmSans = localFont({
  src: [
    {
      path: "../public/fonts/DMSans-latin-var.woff2",
      weight: "100 1000",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const degular = localFont({
  src: [
    {
      path: "../public/fonts/Degular-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-degular",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Proposta audiovisual · FSB Holding | Jhon Camilo Rios",
  description: "Proposta personalizada para edição de 14 vídeos institucionais. Escopo, portfólio audiovisual, processo e investimento.",
  robots: { index: false, follow: false },
  openGraph: { title: "Proposta audiovisual · FSB Holding", description: "14 vídeos. Uma linguagem visual consistente. Por Jhon Camilo Rios.", locale: "pt_BR", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR" className={`${dmSans.variable} ${degular.variable}`}><body>{children}</body></html>;
}
