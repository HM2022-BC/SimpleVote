FROM node:16

WORKDIR /app/ethereum

COPY ethereum/package.json .
RUN npm install

WORKDIR /app
COPY package.json .
RUN npm install

copy . .

CMD ["node", "server.js"]
