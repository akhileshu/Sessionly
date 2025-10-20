import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import ViteSitemap from "vite-plugin-sitemap";
import { createHtmlPlugin } from "vite-plugin-html";
// import { ViteSSG } from "vite-ssg";


// const routes = [
//   { path: "/", name: "Home" },
// ];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    ViteSitemap({
      hostname: "https://akhileshu.github.io/Sessionly",
      generateRobotsTxt: true,
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "Sessionly - Task Manager & Productivity Tracker",
          description:
            "Boost your productivity with Sessionly's Pomodoro timer and task analytics.",
        },
      },
    }),
  ],
  base: "/Sessionly/", // <-- your repo name
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
