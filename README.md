# Form Questions

This project aims to provide a simple and clean interface for displaying and responding to questions asked through a Google Form, which are logged in a Google Sheet. Currently, it is designed to handle forms with a "Name" field, and a "Question" field. The connection button in the top right corner can be used to open a separate window that connects to the main window via WebRTC. This window can be opened inside OBS, and should automatically set its background to transparent in that case.

## Screenshot

![2021-10-30T01:10:03,873844231-04:00](https://user-images.githubusercontent.com/36740602/139521036-6682cbc3-4721-4336-a9ec-9629d0ebe963.png)

## Note on Security

This application is built as a single-page [Svelte](https://svelte.dev/) application. There is no client/server architecture, and so API credentials are visible in the client-side application. Make sure you restrict the scope of the API key you're using to be that of your own domain, otherwise it can be extracted and misused.

## Usage

To get started, clone the repository and rename or copy the [`example.env`](example.env) file to `.env`, then fill in all fields. You will need to supply a client ID, an API key, the C for a Google Cloud Platform project with the Sheets API in its scope, and <http://localhost:5000> as both an authorized JavaScript origin and redirect URI. Visit <https://console.cloud.google.com/apis/credentials> to set this up.

### Running via Docker

```bash
git clone https://github.com/mtoohey31/form-questions
cd form-questions
docker-compose up
```

Note that credentials are stored inside the container so you shouldn't push it to Docker Hub or anything like that.

## Contributing

If you would like to contribute, run these commands to clone the repo and run it in dev mode:

```bash
git clone https://github.com/mtoohey31/form-questions
cd form-questions
pnpm install
pnpm run dev
```

Any changes written to files should automatically be reloaded and displayed.

Note that if you would like to modify or test anything where you need the project to have access to questions from a Google Sheet, you will need to fill out the `.env` file as [previously explained above](#usage).
