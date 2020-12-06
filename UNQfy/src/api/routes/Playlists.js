const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../../models/UnqfyError');

const validateValueFromRequestExists = (value, field) => {
  if (!value) {
    throw new BadRequestError(`'${field}' must be present`);
  }
}

router.get("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  const playlistId = Number(req.params.id);

  try {
    const playlist = unqfy.getPlaylistById(playlistId);
    res.status(200).send(playlist.serialize({ deep: true }));
  } catch(error) {
    next(error);
  }
});

router.get("/", (req, res, next) => {
  const unqfy = req.unqfy;

  try {
    const name = req.query.name;
    const durationLesserThan = Number(req.query.durationLT);
    const durationGreaterThan = Number(req.query.durationGT);
    const filters = { name, durationLesserThan, durationGreaterThan };

    const playlists = unqfy.searchPlaylists({ filters });
    res.status(200).send(playlists.map((playlist) => playlist.serialize({ deep: true })));
  } catch(error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  const unqfy = req.unqfy;

  try {
    const { name, genres, maxDuration, tracks } = req.body;
    validateValueFromRequestExists(name, 'name');

    if(genres || maxDuration) {
      validateValueFromRequestExists(genres, 'genres');
      validateValueFromRequestExists(maxDuration, 'maxDuration');

      const createdPlaylist = unqfy.createPlaylist(name, genres, Number(maxDuration));
      res.status(201).send(createdPlaylist.serialize({ deep: true }));
    } else {
      validateValueFromRequestExists(tracks, 'tracks');
      
      const tracksIds = tracks.map(track => Number(track));
      const createdPlaylist = unqfy.createPlaylistFromTracks(name, tracksIds);
      res.status(201).send(createdPlaylist.serialize({ deep: true }));
    }
  } catch(error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  const unqfy = req.unqfy;
  const playlistId = Number(req.params.id);

  try {
    unqfy.removePlaylist(playlistId);
    res.status(204).send();
  } catch(error) {
    next(error);
  }
});

module.exports = router;
