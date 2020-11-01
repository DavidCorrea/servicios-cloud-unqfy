const express = require('express');
const router = express.Router();
const { ResourceNotFoundError } = require('../../models/UnqfyError');

const serializePlaylist = (playlist) => {
  return {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks.map(track => track.title),
    duration: playlist.duration()
  }
}

router.get("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
