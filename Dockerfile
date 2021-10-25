FROM node:16

WORKDIR /usr/src/form-questions
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 3000
ENV HOST=0.0.0.0
ENTRYPOINT ["pnpm", "run", "preview", "--", "--host"]
