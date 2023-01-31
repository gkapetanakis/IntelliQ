import App from "./App.svelte";
import { clearStorage } from "./stores/dataStores";

const app = new App({
    target: document.getElementById("app")
});

export default app;

/* How Svelte does things. This basically puts our
 * app on the "app" element which is a div in the body
 * of the "index.html" file. */