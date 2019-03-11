FROM node:10.15.1-jessie-slim

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /usr/app/node_modules && cp -a ./node_modules /usr/app/

WORKDIR /usr/app
VOLUME /usr/app/server/public
ENV DOCKER=true
ENV NODE_ENV=production
ENV PORT=80

COPY . .

EXPOSE 80

CMD ["/bin/bash", "./docker/startup.sh"]

