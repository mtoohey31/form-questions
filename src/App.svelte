<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Index from "./Index.svelte";
  import Live from "./Live.svelte";

  export let url = "";
</script>

<div
  class="bg-gray-100 text-black dark:bg-trueGray-800 dark:text-white h-screen w-screen flex flex-col"
>
  <Router {url}>
    <Route path="/">
      <Index />
    </Route>
    <Route path="live">
      <Live />
    </Route>
  </Router>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
