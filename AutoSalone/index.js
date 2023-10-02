//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// prende la libreria express
// prende la libreria FileSystem

// Crea un app da express
// Siamo sulla porta 3005 (porta dove espone questo servizio IN LOCAL) SOLO DA Postman

// installato pacchetto bodyParser per l'interpretazione dei dati del body di una richiesta
//(inclusi nella richiesta http)

// Variabile "dataFilePath" all'interno di express per leggere e scrivere un file json
// dataFilePath --> rappresenta il PATH del file json 
// Installazione: npm install fs.promises
// importazione:  const fsPromises = require('fs').promises;
// Importato: swaggerUi e swaggerJsdoc
// Porta dove ascolto "port = 3005"
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const fs= require('fs').promises;
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const bodyParser = require('body-parser');
//const dataFilePath = './lista.json';    //lo dichiariamo in ogni metodo nel caso volessimo scrivere su file diversi
const port = 3005;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Codice per settare la swagger documentation
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const options = {
  definition:{
    openapi: '3.0.0',
    info:{
      title:'API\ Autosalone',
      version:'1.0.0'
    },
    // servers:[
    //   {
    //     url: 'http://localhost:3005',
    //     description: 'server test',
    //   }
    // ]
  },
  apis:['./index.js'],
};
const specs = swaggerJsdoc(options);
module.exports = specs;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/swagger.json',(req,res) =>{
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Middleware per gestire dati JSON in entrata     -->   Utilizza "express.json());" per gestire i dati JSON 
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.use(bodyParser.json());

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Middleware per leggere i dati dal file JSON
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const readDataFromFile = async (dataFilePath) => {
  try {
    const data = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
    return data;
  } catch (err) {
    // Se il file non esiste o ci sono errori nella lettura, restituisce un array vuoto
    console.error('Errore nella lettura del file:', err);
  }
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Middleware per scrivere i dati nel file JSON
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const writeDataToFile = async (dataFilePath, data) => {
  try {
    // Scrive i dati nel file JSON con formattazione leggibile (indentazione 2 spazi)
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Errore nella scrittura del file:', error);
  }
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 1) GET/getAllAutos      --> Lista di tutte le automobili dell'autosalone
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/getAllAutos:
 *    get:
 *      summary: Lista di tutte le automobili dell'autosalone
 *      description: API per leggere tutte automobili presenti nell'autosalone
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.get('/getallautos', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  res.json(autos);
  res.json(/* Risposta */);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  2) GET/getByMarca  --> Tutte le macchine per MACCHINA marca
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/getByMarca:
 *    get:
 *      summary: Ricerca le auto in base alla marca
 *      description: Trova l'auto in base alla marca
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.get('/getByMarca', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const marca = req.query.Marca;
  // const marca = req.params.marca.toLowerCase();
  const filteredAutos = autos.find((a) => a.Marca.toLowerCase() === marca.toLowerCase());

  if (!filteredAutos) {
    return res.status(404).json({ message: `Nessuna auto trovata per la marca ${marca}` });
  }

  res.status(200).json(filteredAutos);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 3) GET/getById     --> Tutte le macchine, ma filtrata per ID col codice UNIVOCO
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/getById:
 *    get:
 *      summary: Ricerca le auto in base all' ID
 *      description: Trova l'auto in base all' ID
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.get('/getById', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const id = req.query.id;
  // const marca = req.params.marca.toLowerCase();
  const filteredAutos = autos.find((a) => a.id === id);

  if (!filteredAutos) {
    return res.status(404).json({ message: `Nessuna auto trovata per id ${id}` });
  }

  res.status(200).json(filteredAutos);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 4) GET/getCheaperOrEqualsThan --> Tutte le macchine per MACCHINA prezzo  (- di 1.000 $)
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/getCheaperOrEqualsThan:
 *    get:
 *      summary: Cerca le auto con il prezzo inferiore a 25.000 euro
 *      description: Trova tutte le auto con il prezzo inferiore a 25.000 euro
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.get('/getCheaperOrEqualsThan', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const prezzo = req.query.prezzo;
  const filteredAutos = autos.filter((a) => a.prezzo <= prezzo);

  if (!filteredAutos) {
    return res.status(404).json({ message: `Nessuna auto trovata per un prezzo uguale o inferiore a:  ${prezzo}` });
  }

  res.status(200).json(filteredAutos);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  5) POST/addAuto --> Inserimento quando ne mettiamo una nuova
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/addAuto:
 *    post:
 *      summary: Inserimento di una nuova auto
 *      description: Inserisce una nuova auto
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.post('/addAuto', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const newAuto = req.body;
  autos.push(newAuto);
  await writeDataToFile(dataFilePath, autos);
  res.json({ message: 'Auto aggiunta con successo' });

});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 6) DEL/delAuto    --> RIMUOVIAMO un'auto per ID
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/delAuto:
 *    del:
 *      summary: Rimozione di una auto in base all' ID
 *      description: Rimuove l'auto in base al suo ID
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.del('/delAuto', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const id = req.query.id;
  const index = autos.findIndex((a) => a.id === id);

  if (index !== -1) {
    autos.splice(index, 1);
    await writeDataToFile(dataFilePath, autos);
    res.json({ message: `Auto con ID ${id} eliminata con successo` });
  } else {
    res.status(404).json({ message: `Elemento ${id} non presente in autosalone` });
  }
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 07) PATCH/updateAutoPrice --> Modifichiamo i campi di una macchina (es: cambiamo il prezzo)
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/v1/delAuto:
 *    patch:
 *      summary: Modifica il prezzo dell'auto in base al suo ID
 *      description: Modifica il prezzo dell'auto in base all' ID
 *      responses:
 *          '200':
 *            description: risposta con esito positivo
 *          '404':
 *            description: Not found
 */
app.patch('/updateAutoPrice', async (req, res) => {
  const dataFilePath = './lista.json';
  const autos = await readDataFromFile(dataFilePath);
  const id = req.query.id;
  const updatedPrice = req.body.prezzo;
  const auto = autos.find((a) => a.id === id);

  if (auto) {
    auto.prezzo = updatedPrice;
    await writeDataToFile(dataFilePath, autos);
    res.json({ message: `Prezzo dell'auto con ID ${id} aggiornato con successo` });
  } else {
    res.status(404).json({ message: `Elemento ${id} non presente in autosalone` });
  }
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Avvia il server Express
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server Express in ascolto sulla porta ${port}`);
});