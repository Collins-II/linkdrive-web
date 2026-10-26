import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disable only during dev (important for Windows builds)
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest.json$/], // prevents trace file lock issues
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      "www.facebook.com",
      "flagcdn.com",
      "images.pexels.com",
      "cdn-images.dzcdn.net",
      "i.ytimg.com",
      "img.youtube.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "www.pngall.com",
      "maps.googleapis.com",
      "res.cloudinary.com",
      "pngimg.com",
      "image-cdn-fa.spotifycdn.com",
      "mosaic.scdn.co",
      "image-cdn-ak.spotifycdn.com",
      "i.scdn.co",
    ].map((hostname) => ({ hostname, pathname: "/**" })),
  },
  turbopack: {},
};

export default withPWA(nextConfig);