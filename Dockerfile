FROM node:10.15-alpine

RUN apk add --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/ \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/main \
    vips-dev fftw-dev build-base python

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /usr/app/node_modules && cp -a ./node_modules /usr/app/

WORKDIR /usr/app
VOLUME /usr/app/public

COPY . .

ENV DOCKER=true
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "run", "start"]
