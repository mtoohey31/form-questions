<script lang="ts">
  import { mdiGoogleSpreadsheet } from "@mdi/js";
  import type { SheetInfo } from "../../form-questions.js";
  import IconButton from "./IconButton.svelte";

  export let oAuthToken: string;
  export let sheetInfo: SheetInfo;

  let pickerApiLoaded = false;

  window.loadPicker = () => {
    gapi.load("picker", {
      callback: () => {
        pickerApiLoaded = true;
      },
    });
  };

  function createPicker() {
    let picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.SPREADSHEETS)
      .setAppId(import.meta.env.GAPI_PROJECT_NUMBER)
      .setOAuthToken(oAuthToken)
      .setCallback((data) => {
        if (data.action === "picked") {
          let sheet = data.docs[0];
          sheetInfo = {id: sheet.id, name: sheet.name};
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

<IconButton on:click={createPicker} icon={mdiGoogleSpreadsheet}/>
