const express = require('express');
const router = express.Router();
const UNQfy = require('../src/unqfy');
const unqfy = new UNQfy();

router.get("/", async (req, res) => {
    if(req.query.name) {
        console.log(`El artista solicitado es: ${req.query.name}`);
        try{
            let artist =  unqfy.getArtistByName(req.query.name)
            res.status(200).json(artist);
          } catch(err) {
            console.error(`Unqfy Error: ${err.message}`);
            res.status(400).json({Error: err.message});
          }
    }
    else {
        //se van a devovler todos los artistas ya que no se filtro por nombre
        try{
            let artists =  unqfy.allArtists()
            res.status(200).json(artists);
          } catch(err) {
            console.error(`Unqfy Error: ${err.message}`);
            res.status(400).json({Error: err.message});
          }
    }
});

router.post("/", async (req, res) => {
    let { name, country } = req.body; // destructuring
    try{

        let artist = { name, country }
        console.log("Creando artista...");
        let created = await unqfy.addArtist(artist);
        console.log("Artista creado!", JSON.stringify(created));
        res.status(201).json(created);
    } catch(err){
        console.error(`Unqfy Error: ${err.message}`);
        res.status(409).json({status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    }
});

module.exports = router;