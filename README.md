<h1 align="center">
  <img src="https://raw.githubusercontent.com/ITISEnricoFermi/archivio-digitale-client/81041b2932b032ead156777a6927efe1925b52ca/static/shortcut/safari-pinned-tab.svg?sanitize=true" height="100"><br/>
  📚 Archivio Digitale 📚
</h1>
<p align="center">
  Progetto Archivio Digitale sviluppato per l'ITIS Enrico Fermi.
</p>

# Storia

### 1. Quando è iniziato il progetto?
Lo sviluppo dell’Archivio Digitale ha inizio nel 2016, ma nel corso del tempo ha subito numerose revisioni. Entro la fine del 2019 la piattaforma diverrà operativa e usufruibile da docenti e studenti.

### 2. Qual è lo scopo del progetto?
L’Archivio Digitale ha lo scopo di conservare, e quindi valorizzare, ogni tipologia di materiale didattico prodotto dagli studenti del nostro istituto nel corso degli anni.

### 3. Quali sono le funzionalità dell’Archivio?
La piattaforma è suddivisa in un’Area Riservata e in un’Area Pubblica.
L’Area Riservata è accessibile unicamente ai docenti registrati, che possono effettuare l’upload del materiare didattico sulla piattaforma.
Ogni documento è catalogato per classe, sezione, indirizzo, materia e tipo; è inoltre possibile indicare se il documento debba essere visibile pubblicamente o solo all’interno dell’Area Riservata.
È inoltre possibile creare delle collezioni di documenti accomunati da un medesimo progetto.
Chiunque voglia visionare il materiale online, può accedere allo strumento di ricerca nell’Area Pubblica.

### 4. Com’è stato sviluppato l’Archivio?
Il progetto è stato inizialmente realizzato in PHP, utilizzando il database MySQL. Successivamente la piattaforma è stata trasformata in una Single Page Application utilizzando il framework Vue.js ed è stata ridisegnata affinché potesse adattarsi anche a dispositivi mobile.
Il backend è stato completamente riscritto in Node.js e si è scelto di adottare il database documentale MongoDB.
L’applicazione è stata strutturata sull’architettura REST.

### 5. Perché è importante raccogliere questo materiale?
Nel corso dell’anno scolastico gli studenti producono elaborati, sviluppano progetti e realizzano materiale multimediale utile alla didattica e che al termine del ciclo di studi andrebbe perso.
Con l’Archivio Digitale la scuola si pone l’obiettivo di catalogare questo materiale e renderlo disponibile al pubblico e quindi a chiunque ne possa giovare.
La piattaforma potrà essere inoltre un pratico strumento per i nuovi studenti, che potendo consultare l’Archivio, avranno accesso al materiale prodotto nel corso degli anni precedenti e che potrà risultare utile durante il percorso di studio.

# Progetto

L'Archivio Digitale è suddiviso in cinque repository: 

* 🥞 Stack ([archivio-digitale-stack](https://github.com/ITISEnricoFermi/archivio-digitale-stack)).
* 📚 API Server ([archivio-digitale-server](https://github.com/ITISEnricoFermi/archivio-digitale-server)).
* 🖥️ Web Client ([archivio-digitale-client](https://github.com/ITISEnricoFermi/archivio-digitale-client)).
* 📦 Updater ([archivio-digitale-updater](https://github.com/ITISEnricoFermi/archivio-digitale-updater)).
* 📬 Mailer ([archivio-digitale-mailer](https://github.com/ITISEnricoFermi/archivio-digitale-mailer)).
* 📧 Template Mail ([archivio-digitale-mail](https://github.com/ITISEnricoFermi/archivio-digitale-mail)).

<h1 align="center">
  <img src="https://github.com/ITISEnricoFermi/archivio-digitale-nginx/blob/master/project/Application%20Logic.svg" alt="Application Logic"/>
</h1>

# Installazione

1. Clonare il repository nella destinazione desiderata

```shell
$ git clone https://github.com/ITISEnricoFermi/archivio-digitale-server.git
```

2. Installare le dipendenze

```shell
$ cd archivio-digitale-server/
$ npm install
```

### Primo accesso

Subito dopo l'installazione dell'Archivio è possibile entrare nella piattaforma utilizzando le credenziali dell'utente test.

* **Email:** alan.turing@test.com
* **Password:** alanturing

L'utente detiene i privilegi di admin. Si consiglia di modificare la password dell'account una volta effettuato il primo accesso.

## Authors

* **Riccardo Sangiorgio** - [Richard1984](https://github.com/Richard1984/)
* **Ernesto Montada** - [n4y0n](https://github.com/n4y0n)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
