import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Proposta audiovisual · FSB Holding",
    short_name: "Jhon Camilo Rios",
    description:
      "Edição de 14 vídeos institucionais por Jhon Camilo Rios.",
    start_url: "/",
    display: "browser",
    background_color: "#0A0A0A",
    theme_color: "#622FFD",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
