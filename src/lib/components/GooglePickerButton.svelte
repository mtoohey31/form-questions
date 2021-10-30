<script lang="ts">
  import { mdiGoogleSpreadsheet } from "@mdi/js";
  import type { SheetInfo } from "../../form-questions.js";
  import IconButton from "./IconButton.svelte";

  export let oAuthToken: string;
  export let sheetInfo: SheetInfo;

  // @ts-ignore
  window.loadPicker = () => {
    // @ts-ignore
    gapi.load("picker", {
      callback: (_, err) => {
        if (err) {
          console.error(err);
        }
      },
    });
  };

  function createPicker() {
      // @ts-ignore
    let picker = new google.picker.PickerBuilder()
      // @ts-ignore
      .addView(google.picker.ViewId.SPREADSHEETS)
      .setAppId(import.meta.env.GAPI_PROJECT_NUMBER)
      .setOAuthToken(oAuthToken)
      .setCallback((data) => {
        if (data.action === "picked") {
          let sheet = data.docs[0];
          sheetInfo = { id: sheet.id, name: sheet.name };
        }
      })
      .build();
    picker.setVisible(true);
  }
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://apis.google.com/js/api.js?onload=loadPicker"></script>
</svelte:head>

<IconButton on:click={createPicker} icon={mdiGoogleSpreadsheet} />
