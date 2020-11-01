const express = require('express');
const router = express.Router();
const { ResourceNotFoundError } = require('../../models/UnqfyError');
const { ResourceAlreadyExistError } = require('../../models/UnqfyError');


router.get("/:id", (req, res) => {
  const unqfy = req.unqfy;
  let id = req.params.id;
  try{
    	let artist =  unqfy.getAlbumById(Number(id));
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
      let albums =  unqfy.allAlbums()
      res.status(200).send(albums);
    } catch(err) {
      console.error(`Unqfy Error: ${err.message}`);
      res.status(500).send({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    }
  }
});

router.post("/", (req, res) => {
  const unqfy = req.unqfy;
  let { name, year } = req.body;
  let artistId = Number(req.body.artistId);
  try{
    let created = unqfy.addAlbum(artistId, { name, year });
    res.status(201).send(created);
  } catch(error){
    if(error instanceof ResourceAlreadyExistError) {
      res.status(409).send({ status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    } else if(error instanceof ResourceNotFoundError) {
      res.status(404).send({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
    } else {
      res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
  }
});

router.patch("/:id", (req, res) => {
  const unqfy = req.unqfy;
  let id = req.params.id;
  try{
    let album =  unqfy.getAlbumById(Number(id));
    album.year = req.body.year;
    res.status(200).send(album);
  } catch(err) {
    console.error(`Unqfy Error get id ${id}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

router.delete("/:id", (req,res) => {
  const unqfy = req.unqfy;
  let albumId = Number(req.params.id);
  try{
    let artistId = unqfy.getArtistIdByAlbumId(albumId);
    unqfy.removeAlbum(artistId, albumId);
    res.status(204).send();
  } catch(err){
    console.error(`Unqfy Error get id ${albumId}: ${err.message}`);
    res.status(404).send({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
  }
});

module.exports = router;