#!/bin/sh
cd /usr/app
echo Runing database population...
yarn populate
echo Runing server.
node server/server.js