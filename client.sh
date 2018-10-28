################################
# SCRIPT TO INSTALL THE CLIENT #
################################

rm -Rf ./server/client/*
git clone https://github.com/Richard1984/archivio-fermi-client.git
cd ./archivio-fermi-client/
npm install
npm run build
mv dist/* ../server/client/
rm -Rf ./archivio-fermi-client/
