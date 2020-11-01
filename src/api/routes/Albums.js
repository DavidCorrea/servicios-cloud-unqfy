const express = require('express');
const router = express.Router();
const UNQfyLoader = require('../../lib/UNQfyLoader');
let unqfy = UNQfyLoader.getUNQfy();


router.get("/:id", (req, res) => {
  let id = req.params.id;
  try{
      unqfy = UNQfyLoader.getUNQfy();
    	let artist =  unqfy.getAlbumById(Number(id));
    	UNQfyLoader.saveUNQfy(unqfy);
    	res.status(200).send(artist);
    } catch(err) {
    	console.error(`Unqfy Error get id ${id}: ${err.message}`);
    	res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
    }
});

router.get("/", (req, res) => {
  if(req.query.name) {
    try{
      unqfy = UNQfyLoader.getUNQfy();
      let albums =  unqfy.searchByName(req.query.name).albums;
      res.status(200).send(albums);
    } catch(err) {
      console.error(`Unqfy Error: ${err.message}`);
      res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
    }
  }
  else {
    //se van a devovler todos los artistas ya que no se filtro por nombre
    try{
      unqfy = UNQfyLoader.getUNQfy();
      let albums =  unqfy.allAlbums()
      res.status(200).send(albums);
    } catch(err) {
      console.error(`Unqfy Error: ${err.message}`);
      res.status(500).send({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    }
  }
});

router.post("/", (req, res) => {
  let { name, year } = req.body;
  let artistId = Number(req.body.artistId);
  try{
    unqfy = UNQfyLoader.getUNQfy();
    let created = unqfy.addAlbum(artistId, { name, year });
    UNQfyLoader.saveUNQfy(unqfy);
    res.status(201).send(created);
  } catch(err){
    console.error(`Unqfy Error: ${err.message}`);
    res.status(409).send({status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
  }
});

router.patch("/:id", (req, res) => {
  let id = req.params.id;
  try{
    unqfy = UNQfyLoader.getUNQfy();
    let album =  unqfy.getAlbumById(Number(id));
    album.year = req.body.year;
    UNQfyLoader.saveUNQfy(unqfy);
    res.status(200).send(album);
  } catch(err) {
    console.error(`Unqfy Error get id ${id}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

router.delete("/:id", (req,res) => {
  let albumId = Number(req.params.id);
  try{
    unqfy = UNQfyLoader.getUNQfy();
    let artistId = unqfy.getArtistIdByAlbumId(albumId);
    unqfy.removeAlbum(artistId, albumId);
    UNQfyLoader.saveUNQfy(unqfy);
    res.status(204).send();
  } catch(err){
    console.error(`Unqfy Error get id ${id}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

module.exports = router;