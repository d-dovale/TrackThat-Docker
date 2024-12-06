FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY mountenv.sh /usr/local/bin/mountenv.sh

RUN dos2unix /usr/local/bin/mountenv.sh && chmod +x /usr/local/bin/mountenv.sh

COPY package*.json .

ENV VITE_API_KEY=$env:VITE_API_KEY

RUN npm install

COPY . .

ENTRYPOINT ["bash", "/usr/local/bin/mountenv.sh"]