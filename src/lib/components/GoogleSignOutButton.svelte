<script lang="ts">
   import TextButton from "./TextButton.svelte";
   // @ts-ignore
   window.signOut = () => {
      // @ts-ignore
      let auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();
      oAuthToken = undefined;
      sheetInfo = undefined;
   };
   import type { SheetInfo } from "../../form-questions.js";

   export let oAuthToken: string;
   export let sheetInfo: SheetInfo;
</script>

<TextButton
   on:click={() => {
      // @ts-ignore
      window.signOut();
   }}>Sign Out</TextButton
>
