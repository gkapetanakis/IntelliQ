import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: { https: true, port: 443 },
  preview: { https: true, port: 443 },
  plugins: [svelte(), mkcert()],
});
