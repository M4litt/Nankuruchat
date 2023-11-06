FROM node:18.17.1

RUN mkdir -p ./app
RUN mkdir -p ./app/public/certs
WORKDIR /app/

COPY ./dist/* /app/
COPY ./package.json /app/
COPY ./*.pem /app/public/certs/
RUN npm install --omit=dev

EXPOSE 4356

CMD [ "node", "index.js" ]
