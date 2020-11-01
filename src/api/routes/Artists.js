const express = require('express');
const router = express.Router();

router.get("/:id", (req, res) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    	let artist =  unqfy.getArtistById(Number(id));
    	res.status(200).send(artist);
    } catch(err) {
    	console.error(`Unqfy Error get id ${id}: ${err.message}`);
    	res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
    }
});

router.get("/", (req, res) => {
  const unqfy = req.unqfy;

  if(req.query.name) {
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
  const unqfy = req.unqfy;
  let { name, country } = req.body; // destructuring

  try{

    let artist = { name, country }
    let created = unqfy.addArtist(artist);
    res.status(201).send(created);
  } catch(err){
    console.error(`Unqfy Error: ${err.message}`);
    res.status(409).send({status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
  }
});

router.put("/:id", (req, res) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let artist =  unqfy.getArtistById(Number(id));
    artist.name = req.body.name
    artist.country = req.body.country
    res.status(200).send(artist);
  } catch(err) {
    console.error(`Unqfy Error get id ${id}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

router.delete("/:id", (req,res) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    unqfy.removeArtist(Number(id));
    res.status(204).send();
  } catch(err){
    console.error(`Unqfy Error get id ${id}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

module.exports = router;
