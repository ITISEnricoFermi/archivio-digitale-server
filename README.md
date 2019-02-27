<h1 align="center">
  <img src="https://raw.githubusercontent.com/Richard1984/archivio-fermi-client/81041b2932b032ead156777a6927efe1925b52ca/static/shortcut/safari-pinned-tab.svg?sanitize=true" height="100"><br/>
  📚 Archivio Digitale ITIS Enrico Fermi 📚
</h1>
<p align="center">
  Progetto Archivio Digitale sviluppato da Riccardo Sangiorgio per l'ITIS Enrico Fermi.
</p>

## Getting Started

L'Archivio Digitale è suddiviso in due repository: [archivio-fermi-server](https://github.com/Richard1984/archivio-fermi-server) e [archivio-fermi-client](https://github.com/Richard1984/archivio-fermi-client).

### Installazione

1. Clonare il repository nella destinazione desiderata

```shell
$ git clone https://github.com/Richard1984/archivio-fermi-server.git
```

2. Installare le dipendenze

```shell
$ cd archivio-fermi-server/
$ npm install
```

3. Avviare il database (MongoDB)

```shell
$ sudo mongod
```

4. Popolare il database

```shell
$ cd server/public/db/
$ node seed.js
```

5. Creare il file di configurazione 

Utilizzare il template: [config.json.example](https://github.com/Richard1984/archivio-fermi-server/blob/master/server/db/config/config.json.example).

```shell
$ cd config/
$ mv config.json.example config.json
```

6. Modificare il file con le proprie impostazioni

```json
{
  "development": {
    "port": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/archivio",
    "JWT_SECRET": "jwtSecret"
  }
}
```

*JWT_SECRET* sarà la chiave utilizzata nei token. Si consiglia di utilizzare una stringa molto complessa.

### Avvio del server

1. Avviare il database (MongoDB)

```shell
$ sudo mongod
```

2. Avviare il server

```shell
$ cd archivio-fermi-server/server/
$ node server.js
```

### Primo accesso

Subito dopo l'installazione del server è possibile entrare nella piattaforma utilizzando le credenziali dell'utente test.

* **Email:** alan.turing@test.com
* **Password:** alanturing

L'utente detiene i privilegi di admin. Si consiglia di modificare la password dell'account una volta effettuato il primo accesso.

## Authors

* **Riccardo Sangiorgio** - [Richard1984](https://github.com/Richard1984/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
