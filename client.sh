################################
# SCRIPT TO INSTALL THE CLIENT #
################################

rm -f ./server/public/index.html
rm -Rf ./server/public/static/
rm -f ./server/public/service-worker.js
git clone https://github.com/Richard1984/archivio-fermi-client.git
cd ./archivio-fermi-client/
npm install
npm run build
mv dist/* ../server/public/
rm -Rf ./archivio-fermi-client/
