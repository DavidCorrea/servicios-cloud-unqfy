const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../../models/UnqfyError');

const serializeArtist = ({ id, name, country, albums }) => {
  return { id, name, country, albums };
}

router.get("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let artist =  unqfy.getArtistById(Number(id));
    res.status(200).send(serializeArtist(artist));
  } catch(err) {
    next(err);
  }
});

router.get("/", (req, res, next) => {
  const unqfy = req.unqfy;
  const nameToLookFor = req.query.name || '';

  try{
    const artists = unqfy.searchByName(nameToLookFor).artists;
    res.status(200).send(artists.map(artist => serializeArtist(artist)));
  } catch(err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  const unqfy = req.unqfy;
  
  try{
    let artist = detructuringArtist(req); // destructuring
    let created = unqfy.addArtist(artist);
    res.status(201).send(serializeArtist(created));
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
    res.status(200).send(serializeArtist(artist));
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

function detructuringArtist(req) {
  try{
    let artist = {};
    artist.name =  req.body.name ? req.body.name : '';
    artist.country = req.body.country ? req.body.country : '';
    return artist;
  }catch(err){
    throw new BadRequestError();
  }
}

module.exports = router;

