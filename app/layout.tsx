import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { site } from "@/data/site";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const titulo = `${site.name} — ${site.tagline}`;

/**
 * Tudo aqui sai de `data/site.ts`. Para preparar o site de um cliente
 * novo, é lá que se mexe — nada nesta página precisa mudar.
 */
export const metadata: Metadata = {
  // Base para transformar caminhos relativos em endereços completos,
  // que é o que o WhatsApp e o Google exigem nas prévias.
  metadataBase: new URL(site.url),
  title: {
    default: titulo,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },

  // A prévia do link — no WhatsApp, no Instagram, no Facebook.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: titulo,
    description: site.description,
    images: [
      {
        url: "/opt/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: site.description,
    images: ["/opt/og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  // Só entra quando houver código; vazio o Next omite a tag.
  verification: site.googleVerification
    ? { google: site.googleVerification }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#201310",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${jost.variable}`}>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
