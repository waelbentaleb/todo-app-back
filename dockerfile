FROM node:12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "src/index.js"]
