<h1 align="center">
  <img src="https://raw.githubusercontent.com/ITISEnricoFermi/archivio-digitale-client/81041b2932b032ead156777a6927efe1925b52ca/static/shortcut/safari-pinned-tab.svg?sanitize=true" height="100"><br/>
  📚 Archivio Digitale 📚
</h1>
<p align="center">
  Progetto Archivio Digitale sviluppato per l'ITIS Enrico Fermi.
</p>

## Progetto

L'Archivio Digitale è suddiviso in cinque repository: 

* API Server ([archivio-digitale-server](https://github.com/ITISEnricoFermi/archivio-digitale-server)).
* Web Client ([archivio-digitale-client](https://github.com/ITISEnricoFermi/archivio-digitale-client)).
* ReverseProxy ([archivio-digitale-nginx](https://github.com/ITISEnricoFermi/archivio-digitale-nginx)).
* Mailer ([archivio-digitale-mailer](https://github.com/ITISEnricoFermi/archivio-digitale-mailer)).
* Template Mail ([archivio-digitale-mail](https://github.com/ITISEnricoFermi/archivio-digitale-mail)).

<h1 align="center">
  <img src="https://github.com/ITISEnricoFermi/archivio-digitale-nginx/blob/master/project/Application%20Logic.svg" alt="Application Logic"/>
</h1>

### Installazione

1. Clonare il repository nella destinazione desiderata

```shell
$ git clone https://github.com/ITISEnricoFermi/archivio-digitale-server.git
```

2. Installare le dipendenze

```shell
$ cd archivio-digitale-server/
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

Utilizzare il template: [config.json.example](https://github.com/ITISEnricoFermi/archivio-digitale-server/blob/master/server/db/config/config.json.example).

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
$ cd archivio-digitale-server/server/
$ node server.js
```

### Primo accesso

Subito dopo l'installazione del server è possibile entrare nella piattaforma utilizzando le credenziali dell'utente test.

* **Email:** alan.turing@test.com
* **Password:** alanturing

L'utente detiene i privilegi di admin. Si consiglia di modificare la password dell'account una volta effettuato il primo accesso.

## Authors

* **Riccardo Sangiorgio** - [Richard1984](https://github.com/Richard1984/)
* **Ernesto Montada** - [n4y0n](https://github.com/n4y0n)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
