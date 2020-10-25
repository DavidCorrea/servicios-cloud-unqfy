const express = require('express');
const router = express.Router();
const UNQfy = require('../src/unqfy');
let unqfy = new UNQfy();
const fs = require('fs'); // necesitado para guardar/cargar unqfy


////
const DATA_FILENAME = 'data.json';
///

router.get("/:id", (req, res) => {
    let id = req.params.id;
    try{
        if (fs.existsSync(DATA_FILENAME)) {
            unqfy = UNQfy.load(DATA_FILENAME);
        }
        let artist =  unqfy.getArtistById(Number(id));
        unqfy.save(DATA_FILENAME);
        res.status(200).send(artist);
      } catch(err) {
        console.error(`Unqfy Error get id ${id}: ${err.message}`);
        res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
      }
});

router.get("/", (req, res) => {
    if(req.query.name) {
        console.log(`El artista solicitado es: ${req.query.name}`);
        try{
            let artist =  unqfy.searchByName(req.query.name).artists;
            res.status(200).send(artist);
          } catch(err) {
            console.error(`Unqfy Error: ${err.message}`);
            res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
          }
    }
    else {
        //se van a devovler todos los artistas ya que no se filtro por nombre
        try{
            let artists =  unqfy.allArtists()
            res.status(200).send(artists);
          } catch(err) {
            console.error(`Unqfy Error: ${err.message}`);
            res.status(500).send({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
          }
    }
});

router.post("/", (req, res) => {
    let { name, country } = req.body; // destructuring
    try{

        let artist = { name, country }
        console.log("Creando artista...");
        let created = unqfy.addArtist(artist);
        unqfy.save(DATA_FILENAME);
        console.log("Artista creado!", JSON.stringify(created));
        res.status(201).send(created);
    } catch(err){
        console.error(`Unqfy Error: ${err.message}`);
        res.status(409).send({status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    }
});


module.exports = router;