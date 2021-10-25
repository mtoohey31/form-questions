<script lang="ts">
  import GooglePickerButton from "./GooglePickerButton.svelte";
  import GoogleSignInButton from "./GoogleSignInButton.svelte";
  import GoogleSignOutButton from "./GoogleSignOutButton.svelte";
  import IconButton from "./IconButton.svelte";
  import Theme from "./Theme.svelte";
  import type { SheetInfo } from "../../form-questions.js";
  import { mdiConnection } from "@mdi/js";

  export let oAuthToken: string;
  export let sheetInfo: SheetInfo;
  export let connectionVisible: boolean;
  export let darkTheme: boolean;
</script>

<div
  class="flex items-center bg-white dark:bg-trueGray-700 p-2 justify-between border-b border-gray-300 dark:border-gray-700 gap-4"
>
  <GooglePickerButton bind:oAuthToken bind:sheetInfo />
  <h1 class="text-xl whitespace-nowrap truncate flex-grow">
    {sheetInfo ? sheetInfo.name : "Form Questions"}
  </h1>
  <IconButton
    icon={mdiConnection}
    on:click={() => {
      connectionVisible = !connectionVisible;
    }}
  />
  <Theme bind:darkTheme />
  <GoogleSignInButton bind:oAuthToken />
  <GoogleSignOutButton bind:oAuthToken bind:sheetInfo />
</div>
