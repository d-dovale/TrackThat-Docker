FROM node:20-alpine

WORKDIR /app

COPY package*.json .

ENV VITE_API_KEY=$env:VITE_API_KEY

RUN npm install

COPY . .

EXPOSE 5173