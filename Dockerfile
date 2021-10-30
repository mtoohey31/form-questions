FROM node:16

ARG VITE_PUBLIC_BASE_URL
ARG VITE_GAPI_API_KEY
ARG VITE_GAPI_CLIENT_ID
ARG VITE_GAPI_PROJECT_NUMBER

WORKDIR /usr/src/form-questions
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 5000
ENTRYPOINT ["pnpm", "run", "serve", "--", "--host", "0.0.0.0"]
