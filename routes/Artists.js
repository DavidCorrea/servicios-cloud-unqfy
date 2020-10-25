const express = require('express');
const router = express.Router();
const ArtistsService = require('../services/Artists')

router.get("/", async (req, res) => {
    if(req.name) {
        console.log("El artista solicitado es:", req.name);
    }
    else {
        console.log("No se recibió ningún nombre de artista");
    }

    //let filters = req.query;
    
    let artistService = new ArtistsService();
    let artist =  artistService.getArtistByName(req.name)
    res.json(artist);
});

module.exports = router;