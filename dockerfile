FROM node:18.17.1

RUN mkdir -p /app
WORKDIR /app/

COPY ./dist/ .
COPY package.json .
RUN npm i --omit=dev

EXPOSE 12471
CMD [ "node", "index.js" ]