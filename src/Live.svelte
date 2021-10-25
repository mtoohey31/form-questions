<script lang="ts">
  import Theme from "./lib/components/Theme.svelte";
  import RemoteConnection from "./lib/components/RemoteConnection.svelte";
  import type { Question, Message } from "./form-questions.js";
  import QuestionBox from "./lib/components/QuestionBox.svelte";

  let connectionVisible: boolean;
  let question: Question;
  let darkTheme: boolean;

  function onMessage(e: MessageEvent<any>) {
    const message = JSON.parse(e.data) as Message;
    switch (message.type) {
      case "question":
        question = message.value;
        break;
      case "darkTheme":
        darkTheme = message.value;
        break;
    }
  }
</script>

<Theme bind:darkTheme buttonVisible={false} />
<RemoteConnection bind:connectionVisible {onMessage} />
{#if question}
  <div class="flex h-full w-full justify-center items-center bg-transparent">
    <QuestionBox bind:question />
  </div>
{/if}
