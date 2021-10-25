<script lang="ts">
  import { mdiBrightness4, mdiBrightness6 } from "@mdi/js";
  import IconButton from "./IconButton.svelte";
  export let buttonVisible = true;
  export let darkTheme =
    localStorage.getItem("theme") !== null
      ? localStorage.getItem("theme") === "dark"
      : window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: {
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
    if (darkTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "theme" && (e.newValue === "dark") !== darkTheme) {
      darkTheme = e.newValue === "dark";
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      darkTheme = !!e.matches;
    });
</script>

{#if buttonVisible}
  {#if darkTheme}
    <IconButton
      on:click={() => {
        darkTheme = !darkTheme;
      }}
      icon={mdiBrightness6}
    />
  {:else}
    <IconButton
      on:click={() => {
        darkTheme = !darkTheme;
      }}
      icon={mdiBrightness4}
    />
  {/if}
{/if}
