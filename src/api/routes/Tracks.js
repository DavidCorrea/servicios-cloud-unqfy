const express = require('express');
const router = express.Router();
const UNQfyLoader = require('../../lib/UNQfyLoader');

router.get("/:id/lyrics", async (req, res) => {
  const unqfy = UNQfyLoader.getUNQfy();
  const trackId = req.params.id;

  try {
    const track = unqfy.getTrackById(Number(trackId));
    const trackLyrics = await unqfy.trackLyrics(track.title);

    res.status(200).send({ name: track.title, lyrics: trackLyrics });
  } catch(error) {
    res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
  }
});

module.exports = router;
