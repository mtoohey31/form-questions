<script>
    import {
        mdiKeyboardSettings,
        mdiLoginVariant,
        mdiLogoutVariant,
        mdiGoogleSpreadsheet,
        mdiWeatherNight,
        mdiWeatherSunny,
        mdiRefresh,
        mdiAlertCircle,
    } from "@mdi/js";
    import {
        Alert,
        AppBar,
        Button,
        Chip,
        Card,
        CardTitle,
        CardText,
        Col,
        Dialog,
        Divider,
        ProgressLinear,
        Row,
        Icon,
        Footer,
        TextField,
        Textarea,
        Tooltip,
        MaterialApp,
    } from "svelte-materialify";

    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    //State variable declaration
    let theme = "light";
    let typing = false;
    let keyboardShortcutsHelp = false;
    let spreadsheetSelection = false;
    let signedIn = false;
    let currentQuestion = 0;
    let nextQuestion = 1;

    //Transition variable declaration
    let nextTransition = false;
    let currentTransition = false;

    //Environment variables
    let spreadsheetID;
    if (typeof env.DEFAULT_SPREADSHEET_ID !== "undefined") {
        spreadsheetID = env.DEFAULT_SPREADSHEET_ID;
    }
    let UPDATE_FREQUENCY = 30000;
    if (
        typeof env.UPDATE_FREQUENCY !== "undefined" &&
        env.UPDATE_FREQUENCY !== ""
    ) {
        UPDATE_FREQUENCY = env.UPDATE_FREQUENCY;
    }
    let CLIENT_ID = env.CLIENT_ID;
    let API_KEY = env.API_KEY;
    let CURRENT_COLUMN_STYLE = "";
    if (
        typeof env.CURRENT_COLUMN_WIDTH !== "undefined" &&
        env.CURRENT_COLUMN_WIDTH !== ""
    ) {
        CURRENT_COLUMN_STYLE = `width:${env.CURRENT_COLUMN_WIDTH};flex-basis:revert;flex-grow:revert`;
    }

    //API Variables
    let DISCOVERY_DOCS = [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
    ];
    let SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    let questions = [];

    onMount(async () => {
        handleClientLoad();
    });

    function handleClientLoad() {
        gapi.load("client:auth2", initClient);
    }

    function initClient() {
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                function () {
                    signedIn = true;
                    updateQuestions();
                    setInterval(function () {
                        updateQuestions();
                    }, UPDATE_FREQUENCY);
                },
                function (error) {
                    console.log(JSON.stringify(error, null, 2));
                    signedIn = false;
                }
            );
    }

    function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn();
        signedIn = true;
    }

    function handleSignoutClick() {
        gapi.auth2.getAuthInstance().signOut();
        signedIn = false;
    }

    function updateQuestions() {
        gapi.client.sheets.spreadsheets.values
            .get({
                spreadsheetId: spreadsheetID,
                range: "Form Responses 1!B2:C",
            })
            .then(
                function (response) {
                    var range = response.result;
                    if (range.values.length > 0) {
                        questions = [];
                        for (var i = 0; i < range.values.length; i++) {
                            var row = range.values[i];
                            questions.push({ name: row[0], question: row[1] });
                        }
                    } else {
                        console.log("No data found.");
                    }
                },
                function (response) {
                    console.log("Error: " + response.result.error.message);
                }
            );
    }

    function handleKeydown(event) {
        if (!typing) {
            switch (event.key) {
                case "s":
                case "x":
                case "d":
                    if (questions.length > nextQuestion + 1) {
                        skip();
                    }
                    break;
                case "a":
                case "n":
                case " ":
                case "ArrowRight":
                    if (questions.length > nextQuestion) {
                        answer();
                    }
                    break;
                case "p":
                case "u":
                case "ArrowLeft":
                    if (currentQuestion > 0) {
                        previous();
                    }
                    break;
            }
        }
    }

    function toggleTheme() {
        if (theme === "light") theme = "dark";
        else theme = "light";
    }

    function skip() {
        nextTransition = true;
        setTimeout(function () {
            nextQuestion += 1;
            nextTransition = false;
        }, 200);
    }

    function answer() {
        nextTransition = true;
        currentTransition = true;
        setTimeout(function () {
            currentQuestion = nextQuestion;
            nextQuestion += 1;
            nextTransition = false;
            currentTransition = false;
        }, 200);
    }

    function previous() {
        nextTransition = true;
        currentTransition = true;
        setTimeout(function () {
            nextQuestion = currentQuestion;
            currentQuestion -= 1;
            nextTransition = false;
            currentTransition = false;
        }, 200);
    }

    function spreadsheetIDUpdate() {
        typing = false;
        updateQuestions();
    }
</script>

<style>
    :global(body) {
        padding: 0px;
    }
    :global(.s-app-bar:not(.tile)) {
        border-radius: 4px;
    }
</style>

<svelte:window on:keydown={handleKeydown} />

<MaterialApp {theme}>
    <div
        style="min-height: 100vh; min-width: calc(100vw - 32px); padding: 16px">
        <AppBar class="yellow darken-2">
            <span slot="title" class="grey-text text-darken-4">Form Questions</span>
            <div style="flex-grow:1" />
            {#if signedIn}
                <Tooltip bottom>
                    <Button class="ma-2" on:click={() => handleSignoutClick()}>
                        <Icon path={mdiLogoutVariant} />
                    </Button>
                    <span slot="tip">Sign Out</span>
                </Tooltip>
            {:else}
                <Tooltip bottom>
                    <Button class="ma-2" on:click={() => handleAuthClick()}>
                        <Icon path={mdiLoginVariant} />
                    </Button>
                    <span slot="tip">Sign In</span>
                </Tooltip>
            {/if}
            <Tooltip bottom>
                <Button
                    class="ma-2"
                    on:click={() => (spreadsheetSelection = true)}>
                    <Icon path={mdiGoogleSpreadsheet} />
                </Button>
                <span slot="tip">Select Spreadsheet</span>
            </Tooltip>
            <Tooltip bottom>
                <Button
                    class="ma-2"
                    on:click={() => (keyboardShortcutsHelp = true)}>
                    <Icon path={mdiKeyboardSettings} />
                </Button>
                <span slot="tip">Keyboard Shortcuts Help</span>
            </Tooltip>
            <Tooltip bottom>
                <Button class="ma-2" on:click={toggleTheme}>
                    {#if theme == 'light'}
                        <Icon path={mdiWeatherSunny} />
                    {:else}
                        <Icon path={mdiWeatherNight} />
                    {/if}
                </Button>
                <span slot="tip">Toggle Theme</span>
            </Tooltip>
        </AppBar>
        <Dialog class="pa-4" bind:active={keyboardShortcutsHelp}>
            <h4>Keyboard Shortcuts Help</h4>
            <br />
            <div class="text-subtitle-1 float-left">Skip:</div>
            <div class="d-flex flex-row justify-end">
                <kbd>s</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>x</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>d</kbd>
            </div>
            <br />
            <div class="text-subtitle-1 float-left">Answer:</div>
            <div class="d-flex flex-row justify-end">
                <kbd>a</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>n</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>→</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>space</kbd>
            </div>
            <br />
            <div class="text-subtitle-1 float-left">Previous:</div>
            <div class="d-flex flex-row justify-end">
                <kbd>p</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>u</kbd>
                <div class="ml-1 mr-1">,</div>
                <kbd>←</kbd>
            </div>
        </Dialog>
        <Dialog class="pa-4" bind:active={spreadsheetSelection}>
            <h4>Spreadsheet Selection</h4>
            <br />
            <TextField
                class="pt-4 pl-4 pr-4 pb-1"
                color="yellow darken-2"
                clearable
                dense
                outlined
                counter={44}
                on:focus={() => (typing = true)}
                on:change={() => spreadsheetIDUpdate()}
                bind:value={spreadsheetID}>
                Spreadsheet ID
            </TextField>
        </Dialog>
        {#if signedIn && typeof spreadsheetID !== 'undefined' && spreadsheetID.length === 44 && questions.length > 0}
            <Row noGutters class="align-center">
                <Col>
                    {#if !nextTransition && questions.length > nextQuestion}
                        <div
                            class="d-flex flex-column mt-4 mb-4"
                            transition:fade={{ duration: 200 }}>
                            <Card class="align-items-stretch">
                                <TextField
                                    class="pt-4 pl-4 pr-4 pb-1"
                                    color="yellow darken-2"
                                    clearable
                                    dense
                                    outlined
                                    counter="26"
                                    maxlength="26"
                                    on:focus={() => (typing = true)}
                                    on:change={() => (typing = false)}
                                    bind:value={questions[nextQuestion].name}>
                                    Name
                                </TextField>
                                <div class="pt-1 pl-4 pr-4 pb-4 flex-shrink-1">
                                    <Textarea
                                        color="yellow darken-2"
                                        clearable
                                        dense
                                        outlined
                                        autogrow
                                        rows={3}
                                        counter="171"
                                        maxlength="171"
                                        on:focus={() => (typing = true)}
                                        on:change={() => (typing = false)}
                                        bind:value={questions[nextQuestion].question}>
                                        Question
                                    </Textarea>
                                </div>
                            </Card>
                        </div>
                    {:else if !nextTransition}
                        <div
                            class="d-flex flex-column mt-4 mb-4"
                            transition:fade={{ duration: 200 }}>
                            <Card class="align-items-stretch">
                                <TextField
                                    class="pt-4 pl-4 pr-4 pb-1"
                                    color="yellow darken-2"
                                    clearable
                                    dense
                                    outlined
                                    disabled
                                    counter="26"
                                    maxlength="26"
                                    on:focus={() => (typing = true)}
                                    on:change={() => (typing = false)}>
                                    Name
                                </TextField>
                                <div class="pt-1 pl-4 pr-4 pb-4 flex-shrink-1">
                                    <Textarea
                                        color="yellow darken-2"
                                        clearable
                                        dense
                                        outlined
                                        autogrow
                                        disabled
                                        rows={3}
                                        counter="171"
                                        maxlength="171"
                                        on:focus={() => (typing = true)}
                                        on:change={() => (typing = false)}>
                                        Question
                                    </Textarea>
                                </div>
                            </Card>
                        </div>
                    {/if}
                </Col>
                <Divider vertical inset class="ml-4 mr-4" />
                <Col style={CURRENT_COLUMN_STYLE}>
                    {#if !currentTransition}
                        <div
                            class="d-flex justify-center mt-4 mb-4"
                            transition:fade={{ duration: 200 }}>
                            <Card>
                                <Chip
                                    label
                                    class="mt-4 ml-4 mr-4 yellow darken-2">
                                    <CardTitle class="pa-0 ma-0">
                                        {questions[currentQuestion].name}
                                    </CardTitle>
                                </Chip>
                                <CardText>
                                    {questions[currentQuestion].question}
                                </CardText>
                            </Card>
                        </div>
                    {/if}
                </Col>
            </Row>
            <div class="d-flex justify-center ma-10">
                {#if currentQuestion > 0}
                    <Button class="mr-2" on:click={() => previous()}>
                        Previous
                    </Button>
                {:else}
                    <Button class="mr-2" disabled>Previous</Button>
                {/if}
                {#if questions.length > nextQuestion}
                    <Button class="ml-2 mr-2" on:click={() => answer()}>
                        Answer
                    </Button>
                {:else}
                    <Button class="ml-2 mr-2" disabled>Answer</Button>
                {/if}
                {#if questions.length > nextQuestion + 1}
                    <Button class="ml-2" on:click={() => skip()}>Skip</Button>
                {:else}
                    <Button class="ml-2" disabled>Skip</Button>
                {/if}
            </div>
            <Footer class="justify-center pa-2" absolute>
                <div class="d-flex justify-center">
                    <Chip class="mb-2 mr-1">{currentQuestion} Answered</Chip>
                    <Chip class="mb-2 mr-1 ml-1">
                        {questions.length - currentQuestion}
                        Remaining
                    </Chip>
                    <Chip class="mb-2 ml-1">{questions.length} Total</Chip>
                </div>
                <ProgressLinear
                    color="yellow darken-2"
                    backgroundColor="grey darken-1"
                    value={(currentQuestion / questions.length) * 100} />
            </Footer>
        {:else}
            <Alert class="error-color mt-4">
                <div slot="icon">
                    <Icon path={mdiAlertCircle} />
                </div>
                <h6 class="text-h6">To get started, please:</h6>
                {#if !signedIn}
                    <div class="text-body-1">• Sign in</div>
                {:else if typeof spreadsheetID === 'undefined' || spreadsheetID.length !== 44}
                    <div class="text-body-1">
                        • Enter a valid spreadsheet ID
                    </div>
                {/if}
            </Alert>
            <Footer class="justify-center pa-2" absolute>
                <ProgressLinear
                    color="yellow darken-2"
                    backgroundColor="grey darken-1"
                    indeterminate />
            </Footer>
        {/if}
    </div>
</MaterialApp>
