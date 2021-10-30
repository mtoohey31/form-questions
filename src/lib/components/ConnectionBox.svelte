<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let offerTextArea: HTMLElement;
  let answerTextArea: HTMLElement;

  onMount(() => {
    offerTextArea.focus();
  });

  export let offer: string;
  export let answer: string;
  export let submitText: string;
  export let onSubmit: () => void;
  export let editable: "offer" | "answer";
  export let closeable = true;
  export let instructions = false;
  export let refocus: "onMouseLeave" | "onSubmit";

  const JSONPlaceholder = "{}";

  export let connectionVisible: boolean;
</script>

<div
  class="fixed h-screen w-screen flex flex-col justify-center items-center bg-white bg-opacity-50 z-10"
  transition:fade={{ duration: 100 }}
>
  <!-- TOOD: Fix height -->
  <div
    on:mouseleave={() => {
      if (refocus == "onMouseLeave") answerTextArea.focus();
    }}
    class="shadow-2xl rounded-lg p-4 bg-white dark:bg-trueGray-800 max-h-3/4"
    style="min-width: 75%;"
  >
    {#if instructions}
      <h1 class="text-xl mb-2">Instructions</h1>
      <ol class="list-decimal ml-4">
        <li>
          First, open: <a
            class="text-googleBlue hover:underline"
            href={document.location.href + "live"}
            target="_blank">{document.location.href}live</a
          >.
        </li>
        <li>Paste the offer below into the offer box there</li>
        <li>Click "Create Answer" on that window.</li>
        <li>Then copy the answer from there into the answer here.</li>
        <li>Click "Connect".</li>
      </ol>
      <hr class="my-2" />
    {/if}
    <label for="offer" class="block">Offer</label>
    <textarea
      bind:this={offerTextArea}
      name="offer"
      id="offer"
      class="block border p-2 w-full dark:bg-trueGray-700 font-mono"
      placeholder={JSONPlaceholder}
      bind:value={offer}
      readonly={editable !== "offer"}
    />
    <label for="answer" class="block">Answer</label>
    <textarea
      bind:this={answerTextArea}
      name="answer"
      id="answer"
      class="block border p-2 w-full dark:bg-trueGray-700 font-mono"
      placeholder={JSONPlaceholder}
      bind:value={answer}
      readonly={editable !== "answer"}
    />
    <div class="flex justify-end gap-4 mt-4">
      {#if closeable}
        <button
          class="bg-white hover:shadow-blue transition text-googleBlue shadow-md p-2 border-googleBlue border"
          on:click={() => {
            connectionVisible = !connectionVisible;
          }}
          >Close
        </button>
      {/if}
      <button
        class="bg-googleBlue text-white hover:shadow-blue transition shadow-md p-2 border-googleBlue border"
        on:click={() => {
          if (refocus === "onSubmit") {
            answerTextArea.focus();
          }
          onSubmit();
        }}
        >{submitText}
      </button>
    </div>
  </div>
</div>
