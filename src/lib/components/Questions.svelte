<script lang="ts">
  export let oAuthToken: any;
  export let sheetID: string;
  export let currentQuestionObject: Question;

  import QuestionBox from "./QuestionBox.svelte";
  import type { Question } from "../../form-questions.js";
  import { mdiLoading } from "@mdi/js";
  import TextButton from "./TextButton.svelte";

  let questions: Question[];
  let currentQuestion = 0;
  $: nextDisabled = questions ? currentQuestion >= questions.length : true;
  let nextQuestion = 1;
  $: skipDisabled = questions ? nextQuestion >= questions.length : true;
  type UndoAction = "skip" | "next";
  let undoDisabled = true;
  let undoStack: UndoAction[] = [];
  $: undoDisabled = undoStack.length === 0;
  let gapiLoaded = false;
  let errorText: string = undefined;

  $: {
    oAuthToken;
    sheetID;
    questions = undefined;
    currentQuestion = 0;
    if (gapiLoaded) updateQuestions();
  }

  $: if (questions) currentQuestionObject = questions[currentQuestion];

  // @ts-ignore
  window.loadSheets = () => {
    // @ts-ignore
    gapi.load("client:auth2", {
      callback: () => {
        // @ts-ignore
        gapi.client
          .init({
            apiKey: import.meta.env["VITE_GAPI_API_KEY"],
            clientId: import.meta.env["VITE_GAPI_CLIENT_ID"],
            discoveryDocs: [
              "https://sheets.googleapis.com/$discovery/rest?version=v4",
            ],
            scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
          })
          .then(
            () => {
              gapiLoaded = true;
              updateQuestions();
            },
            (error) => {
              console.error(error);
            }
          );
      },
    });
  };

  function updateQuestions() {
    errorText = undefined;
    // @ts-ignore
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: sheetID,
        range: "Form Responses 1!B2:C",
      })
      .then(
        function (response: { result: { values: [string, string][] } }) {
          questions = response.result.values.map((row: string[]) => {
            return { name: row[0], body: row[1] };
          });
        },
        function (response: { result: { error: { message: string } } }) {
          const message = response.result.error.message;
          switch (message) {
            case "Unable to parse range: Form Responses 1!B2:C":
              errorText = "Incorrect Sheet Format";
              break;
            case "The caller does not have permission":
              errorText = "No Permissions for Sheet";
              break;
            default:
              console.error(message);
          }
        }
      );
  }
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://apis.google.com/js/api.js?onload=loadSheets"></script>
</svelte:head>

{#if questions !== undefined}
  <div class="flex flex-1">
    {#if questions[nextQuestion] !== undefined}
      <QuestionBox question={questions[nextQuestion]} />
    {:else}
      <div class="w-1/2" />
    {/if}
    <div class="w-0 h-full border-l border-gray-300 dark:border-gray-700" />
    {#if questions[currentQuestion] !== undefined}
      <QuestionBox question={questions[currentQuestion]} />
    {/if}
  </div>
  <div
    class="flex justify-center p-2 border-t border-gray-300 dark:border-gray-700 gap-4"
  >
    <div class="absolute right-0 mr-4 h-google flex items-center">
      <div class="text-googleBlue font-mono">
        <input
          class="w-8 text-right border dark:bg-trueGray-700 font-mono"
          type="number"
          bind:value={nextQuestion}
          on:blur={(e) => {
            // @ts-ignore
            const value = e.target.value;
            if (value === "") {
              nextQuestion = 1;
            } else {
              nextQuestion = parseInt(value);
            }
          }}
        />
        / {questions.length}
      </div>
    </div>
    <TextButton
      bind:disabled={undoDisabled}
      on:click={() => {
        let popped = undoStack.slice(-1)[0];
        undoStack = undoStack.slice(0, -1);
        switch (popped) {
          case "skip":
            nextQuestion -= 1;
            break;
          case "next":
            currentQuestion -= 1;
            nextQuestion -= 1;
        }
      }}
    >
      Undo
    </TextButton>
    <TextButton
      bind:disabled={nextDisabled}
      on:click={() => {
        nextQuestion += 1;
        currentQuestion += 1;
        undoStack = undoStack.concat(["next"]);
        if (gapiLoaded) updateQuestions();
      }}
    >
      Next
    </TextButton>
    <TextButton
      bind:disabled={skipDisabled}
      on:click={() => {
        nextQuestion += 1;
        undoStack = undoStack.concat(["skip"]);
        if (gapiLoaded) updateQuestions();
      }}
    >
      Skip
    </TextButton>
  </div>
{:else if questions && questions.length === 0}
  <div class="h-full w-full flex justify-center items-center">
    <div class="shadow-lg flex bg-googleBlue text-white rounded-lg p-4 gap-4">
      <div class="text-2xl">No Questions Yet...</div>
    </div>
  </div>
{:else if errorText !== undefined}
  <div class="h-full w-full flex justify-center items-center">
    <div class="shadow-lg flex bg-red-500 text-white rounded-lg p-4 gap-4">
      <div class="text-2xl">{errorText}</div>
    </div>
  </div>
{:else}
  <div class="h-full w-full flex justify-center items-center">
    <div class="shadow-lg flex bg-googleBlue text-white rounded-lg p-4 gap-4">
      <div class="text-2xl">Loading</div>
      <svg viewBox="0 0 24 24" class="w-8 fill-current animate-spin">
        <path d={mdiLoading} />
      </svg>
    </div>
  </div>
{/if}

<style global>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
