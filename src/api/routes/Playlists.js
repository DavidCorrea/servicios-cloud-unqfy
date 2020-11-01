const express = require('express');
const router = express.Router();
const { ResourceNotFoundError, ResourceAlreadyExistsError, BadRequestError } = require('../../models/UnqfyError');

const serializePlaylist = (playlist) => {
  return {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks.map(track => track.title),
    duration: playlist.duration()
  }
}

const validateValueFromRequestExists = (value, field) => {
  if (!value) {
    throw new BadRequestError(`'${field}' must be present`);
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

router.get("/", (req, res) => {
  const unqfy = req.unqfy;

  try {
    const name = req.query.name;
    const durationLesserThan = Number(req.query.durationLT);
    const durationGreaterThan = Number(req.query.durationGT);
    const filters = { name, durationLesserThan, durationGreaterThan };

    const playlists = unqfy.searchPlaylists({ filters });
    res.status(200).send(playlists.map((playlist) => serializePlaylist(playlist)));
  } catch(error) {
    res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.post("/", (req, res) => {
  const unqfy = req.unqfy;

  try {
    const { name, genres, maxDuration, tracks } = req.body;
    validateValueFromRequestExists(name, 'name');

    if(genres || maxDuration) {
      validateValueFromRequestExists(genres, 'genres');
      validateValueFromRequestExists(maxDuration, 'maxDuration');

      const createdPlaylist = unqfy.createPlaylist(name, genres, Number(maxDuration));
      res.status(201).send(serializePlaylist(createdPlaylist));
    } else {
      validateValueFromRequestExists(tracks, 'tracks');
      
      const tracksIds = tracks.map(track => Number(track));
      const createdPlaylist = unqfy.createPlaylistFromTracks(name, tracksIds);
      res.status(201).send(serializePlaylist(createdPlaylist));
    }
  } catch(error) {
    if(error instanceof BadRequestError) {
      res.status(400).send({ status: 400, errorCode: 'BAD_REQUEST' });
    } else if(error instanceof ResourceAlreadyExistsError) {
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
