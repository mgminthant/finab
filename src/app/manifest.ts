import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard",
    name: "Budget Tracker",
    short_name: "Budget",
    description: "Personal budget tracker",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0f171b",
    theme_color: "#0d9488",
    screenshots: [
      {
        src: "/screenshots/wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/narrow.png",
        sizes: "640x1136",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
