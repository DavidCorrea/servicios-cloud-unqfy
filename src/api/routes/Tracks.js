const express = require('express');
const router = express.Router();

router.get("/:id/lyrics", async (req, res, next) => {
  const unqfy = req.unqfy;
  const trackId = req.params.id;

  try {
    const track = unqfy.getTrackById(Number(trackId));
    const trackLyrics = await unqfy.trackLyrics(track.title);

    res.status(200).send({ name: track.title, lyrics: trackLyrics });
  } catch(error) {
    next(error);
  }
});

module.exports = router;
