import App from "./App.svelte";
import "@fontsource/roboto/400.css";

const app = new App({
  target: document.getElementById("app"),
  // hydrate: true,
});

export default app;
