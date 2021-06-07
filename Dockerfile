FROM node:14-slim

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["node", "./dist/src/index.js"]
