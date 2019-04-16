FROM node:10.15.2-jessie

#Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

WORKDIR /tmp
COPY package.json /tmp/package.json
RUN npm install && mkdir -p /app/node_modules && cp -a ./node_modules /app/

WORKDIR /app
ENV DOCKER=true
ENV NODE_ENV=production
ENV PORT=80

COPY . .

EXPOSE 80
CMD ["/bin/bash", "./docker/startup.sh"]

