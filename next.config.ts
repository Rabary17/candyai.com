import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Visuels des articles de blog (autopilote) : hotlink exigé par Unsplash, comme sur techno-play
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/alternatives/candy-ai-vs-:x/", destination: "/vs/candy-ai-vs-:x/", permanent: true },
      { source: "/fr/alternatives/candy-ai-vs-:x/", destination: "/fr/vs/candy-ai-vs-:x/", permanent: true },
      { source: "/blog/how-do-you-use-a-character-ai-chat-bot-without-wasting-time-or-handing-over-more/", destination: "/blog/character-ai-chat-bot/", permanent: true },
      { source: "/ai-girlfriend/create-your-own/", destination: "/ai-girlfriend/generator/", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ] },
    ];
  },
};
export default config;
