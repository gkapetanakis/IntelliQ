import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import mkcert from "vite-plugin-mkcert";

export default ({ mode }) => {
    // load vite env variables into the process environment
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        plugins: [svelte(), mkcert()],
        server: { // dev server options
            https: process.env.VITE_USE_HTTPS === "true",
            host: process.env.VITE_APP_HOST,
            port: process.env.VITE_APP_PORT
        },
        preview: { // preview server options
            https: process.env.VITE_USE_HTTPS === "true",
            host: process.env.VITE_APP_HOST,
            port: process.env.VITE_APP_PORT
        }
    });
}
