<script lang="ts">
  import Questions from "./lib/components/Questions.svelte";
  import Header from "./lib/components/Header.svelte";
  import LocalConnection from "./lib/components/LocalConnection.svelte";
  import type { SheetInfo, Question } from "./form-questions.js";

  let dataChannel: RTCDataChannel;
  let oAuthToken: string;
  let sheetInfo: SheetInfo;
  let connectionVisible = false;
  let darkTheme: boolean;
  let currentQuestionObject: Question;

  try {
    sheetInfo = JSON.parse(localStorage.getItem("previousSheet"));
  } catch {}
  $: if (sheetInfo) {
    localStorage.setItem("previousSheet", JSON.stringify(sheetInfo));
  }
  $: if (dataChannel) {
    dataChannel.onopen = () => {
      dataChannel.send(JSON.stringify({ type: "darkTheme", value: darkTheme }));
      dataChannel.send(
        JSON.stringify({ type: "question", value: currentQuestionObject })
      );
    };
  }
  $: if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(
      JSON.stringify({ type: "question", value: currentQuestionObject })
    );
  }
  $: if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(JSON.stringify({ type: "darkTheme", value: darkTheme }));
  }
</script>

<LocalConnection bind:dataChannel bind:connectionVisible />
<Header bind:oAuthToken bind:sheetInfo bind:connectionVisible bind:darkTheme />
{#if sheetInfo}
  <Questions bind:oAuthToken bind:sheetID={sheetInfo.id} bind:currentQuestionObject />
{/if}
