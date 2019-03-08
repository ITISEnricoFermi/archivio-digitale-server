#!/bin/sh
cd /usr/app
echo Running database population and server
npm run populate && node server/server.js