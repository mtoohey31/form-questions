<script lang="ts">
  import { fade } from "svelte/transition";

  import type { Question } from "../../form-questions.js";
  export let question: Question;

  let fadingIn = true;

  let prevQuestion: Question;

  $: {
    if (
      prevQuestion !== undefined &&
      (prevQuestion.name !== question.name ||
        prevQuestion.body !== question.body)
    ) {
      fadingIn = false;
      setTimeout(() => {
        fadingIn = true;
      }, 200);
    }
    prevQuestion = question;
  }
</script>

<!-- TODO: Add smooth animations here -->
<div class="flex justify-center items-center w-1/2 p-4">
  {#if fadingIn}
    <div
      class="shadow-md rounded-lg p-4 bg-white dark:bg-trueGray-700"
      transition:fade={{ duration: 100 }}
    >
      <div class="text-xl">
        {question.name}
      </div>
      <hr class="my-3" />
      <div>
        {question.body}
      </div>
    </div>
  {/if}
</div>
