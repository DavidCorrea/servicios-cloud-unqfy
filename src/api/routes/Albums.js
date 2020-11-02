const express = require('express');
const router = express.Router();
const { ResourceNotFoundError, ResourceAlreadyExistError, BadRequestError } = require('../../models/UnqfyError');

router.get("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let artist =  unqfy.getAlbumById(Number(id));
    res.status(200).send(artist);
  } catch(err) {
    next(err);
  }
});

router.get("/", (req, res, next) => {
  const unqfy = req.unqfy;

  if(req.query.name) {
    try{
      let albums =  unqfy.searchByName(req.query.name).albums;
      res.status(200).send(albums);
    } catch(err) {
      next(err);
    }
  }
  else {
    //se van a devolver todos los artistas ya que no se filtro por nombre
    try{
      let albums =  unqfy.allAlbums()
      res.status(200).send(albums);
    } catch(err) {
      next(err);
    }
  }
});

router.post("/", (req, res, next) => {
  const unqfy = req.unqfy;
  let { name, year } = req.body;
  let artistId = isNaN(Number(req.body.artistId)) ? '' : Number(req.body.artistId) ;

  try{
    let created = unqfy.addAlbum(artistId, { name, year });
    res.status(201).send(created);
  } catch(err){
    next(err);
  }
});

router.patch("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let id = req.params.id;

  try{
    let album =  unqfy.getAlbumById(Number(id));
    album.year = req.body.year;
    res.status(200).send(album);
  } catch(err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  let albumId = Number(req.params.id);

  try{
    let artistId = unqfy.getArtistIdByAlbumId(albumId);
    unqfy.removeAlbum(artistId, albumId);
    res.status(204).send();
  } catch(err){
    next(err);
  }
});

module.exports = router;