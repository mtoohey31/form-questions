# Todo

- [x] Get the Sheets API working.
  - [ ] Get Google APIs working as an installed package, not an src tag to improve bandwidth usage.
- [x] Create a `.env` file.
  - [ ] ~~Switch to dotenv-safe.~~ (Decided against due to no support for optional environment variables.)
- [x] Dockerize.
  - [ ] ~~Get dotenv working.~~
  - [x] Create dynamic container that removes the build and rebuilds every time it is run so credentials are never stored in the container.
  - [x] Create static container that stores credentials in the container.
- [x] Fix dark theme background not changing colour.
- [ ] Split things up into separate "presentation" and "presenter mode" windows.
- [ ] Add a graph to show questions answered vs questions asked over time.
- [ ] Get the [picker api](https://developers.google.com/picker/docs) working, instead of having to manually enter the Sheet ID.
- [ ] Implement a profanity filter, and provide option to censor profanity automatically or manually.
