FROM node:10.15.1-jessie-slim

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /usr/app/node_modules && cp -a ./node_modules /usr/app/

WORKDIR /usr/app
VOLUME /usr/app/server/public

COPY . .

ENV DOCKER=true
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npm run populate && node server/server.js"]

