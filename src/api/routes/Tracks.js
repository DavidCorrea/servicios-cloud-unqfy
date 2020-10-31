const express = require('express');
const router = express.Router();
const { ResourceNotFoundError } = require('../../models/UnqfyError');

router.get("/:id/lyrics", async (req, res) => {
  const unqfy = req.unqfy;
  const trackId = req.params.id;

  try {
    const track = unqfy.getTrackById(Number(trackId));
    const trackLyrics = await unqfy.trackLyrics(track.title);

    res.status(200).send({ name: track.title, lyrics: trackLyrics });
  } catch(error) {
    if(error instanceof ResourceNotFoundError) {
      res.status(404).send({ status: 404, errorCode: 'RESOURCE_NOT_FOUND' });
    } else {
      res.status(500).send({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
  }
});

module.exports = router;
