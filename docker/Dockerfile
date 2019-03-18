FROM node:10.15.1-jessie-slim

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /app/node_modules && cp -a ./node_modules /app/

WORKDIR /app
VOLUME /app/server/public
ENV DOCKER=true
ENV NODE_ENV=production
ENV PORT=80

COPY . .

EXPOSE 80
VOLUME /app/server/public
CMD ["/bin/bash", "./docker/startup.sh"]

