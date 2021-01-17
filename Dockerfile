FROM node:12.7.0-alpine

WORKDIR /usr/src/app

COPY server /usr/src/app

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]