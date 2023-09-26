# Esercizi_NodeJs

#Modalità di accesso al server express 
Come lanciare il server index.js (Persone fisiche)

1) Scaricare Nodejs dal seguente link https://nodejs.org/it/download (Windows Installer(.msi))

2) Lanciarlo come "ADMIN"

3) Si va nel path del progetto "C:\Users\riccardo.grano\Desktop\ProgettoNodeJs_1" e si sostituisce con "cmd"
(Dove abbiamo il file index.js)

Lancio i seguenti comandi:

node -v                    --> versione del "Motore"
npm -v                     --> versione del gestore dei pacchetti
npm install express        --> Ti dirà che la versione è Vecchia e va aggiornata

(riga in verde)
npm install -g npm@10.1.0  --> -g (Globale) però lo devi aggiornare in maniera Globale nella tua macchina, non solo sul singolo progetto 
                           --> si creerà una DIR "node_modules" 
                           --> ovvero il compilato delle librerie che ti servono per far girare quello che ho importato in alto (express )

NB: per far partire uno script Nodejs/Javascript
node "nome_script"

node index.js              --> Viene lanciato il Server Express, quindi è in ascolto!!!!



4) Andare su Postman e importare le chiamate di POST e GET 