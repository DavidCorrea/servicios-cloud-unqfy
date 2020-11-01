const express = require('express');
const router = express.Router();
const { ResourceNotFoundError, ResourceAlreadyExistsError } = require('../../models/UnqfyError');

const serializePlaylist = (playlist) => {
  return {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks.map(track => track.title),
    duration: playlist.duration()
  }
}

router.get("/:id", (req, res) => {
  const unqfy = req.unqfy;
  const playlistId = Number(req.params.id);

  try {
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).send(serializePlaylist(playlist));
  } catch(error) {
    if(error instanceof ResourceNotFoundError) {
      res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
    } else {
      res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
  }
});

router.post("/", async (req, res) => {
  const unqfy = req.unqfy;

  try {
    if(req.body.genres) {
      const { name, genres } = req.body;
      const maxDuration = Number(req.body.maxDuration);

      const createdPlaylist = unqfy.createPlaylist(name, genres, maxDuration);
      res.status(201).send(serializePlaylist(createdPlaylist));
    } else {
      const { name } = req.body;
      const tracksIds = req.body.tracks.map(track => Number(track));

      const createdPlaylist = unqfy.createPlaylistFromTracks(name, tracksIds);
      res.status(201).send(serializePlaylist(createdPlaylist));
    }
  } catch(error) {
    if(error instanceof ResourceAlreadyExistsError) {
      res.status(409).send({ status: 409, errorCode: 'RESOURCE_ALREADY_EXISTS' });
    } else if(error instanceof ResourceNotFoundError) {
      res.status(404).send({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
    } else {
      res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
  }
});

router.delete("/:id", (req, res) => {
  const unqfy = req.unqfy;
  const playlistId = Number(req.params.id);

  try {
    unqfy.removePlaylist(playlistId);
    res.status(204).send();
  } catch(error) {
    if(error instanceof ResourceNotFoundError) {
      res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
    } else {
      res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
  }
});

module.exports = router;
