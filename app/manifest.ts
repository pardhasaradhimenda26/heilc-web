import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HEILC — AI & Digital Transformation Agency",
    short_name: "HEILC",
    description:
      "Where Human Intelligence Meets the Future. HEILC builds AI-powered products that prove capability, not just describe it.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#14C5D4",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
