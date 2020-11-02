const express = require('express');
const router = express.Router();

router.get("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let artist =  unqfy.getArtistById(Number(id));
    res.status(200).send(artist);
  } catch(err) {
    next(err);
  }
});

router.get("/", (req, res, next) => {
  const unqfy = req.unqfy;

  if(req.query.name) {
    try{
      let artist =  unqfy.searchByName(req.query.name).artists;
      res.status(200).send(artist);
    } catch(err) {
      next(err);
    }
  }
  else {
    //se van a devovler todos los artistas ya que no se filtro por nombre
    try{
      let artists =  unqfy.allArtists()
      res.status(200).send(artists);
    } catch(err) {
      next(err);
    }
  }
});

router.post("/", (req, res, next) => {
  const unqfy = req.unqfy;
  let { name, country } = req.body; // destructuring

  try{
    let artist = { name, country }
    let created = unqfy.addArtist(artist);
    res.status(201).send(created);
  } catch(err){
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let artist =  unqfy.getArtistById(Number(id));
    artist.name = req.body.name
    artist.country = req.body.country
    res.status(200).send(artist);
  } catch(err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    unqfy.removeArtist(Number(id));
    res.status(204).send();
  } catch(err){
    next(err);
  }
});

module.exports = router;
