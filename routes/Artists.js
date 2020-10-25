const express = require('express');
const router = express.Router();
const ArtistsService = require('../services/Artists')
const artistService = new ArtistsService();

router.get("/", async (req, res) => {
    if(req.query.name) {
        console.log(`El artista solicitado es: ${req.query.name}`);
    }
    else {
        console.log("No se recibió ningún nombre de artista");
    }
    try{
        let artist =  artistService.getArtistByName(req.query.name)
        res.status(200).json(artist);
      } catch(err) {
        console.error(`Unqfy Error: ${err.message}`);
        res.status(400).send(`Unqfy Error: ${err.message}`);
      }
});

module.exports = router;