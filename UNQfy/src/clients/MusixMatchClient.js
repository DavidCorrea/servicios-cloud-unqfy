const axios = require('axios');
const { UnqfyError } = require('../models/UnqfyError');

const baseURL = 'http://api.musixmatch.com/ws/1.1';
const apiKey = process.env.MUSIXMATCH_API_KEY;

const musixMatch = axios.create({
  baseURL
});

// https://developer.musixmatch.com/documentation/api-reference/track-search
const getTrackByTitle = (trackTitle) => {
  return musixMatch.get('/track.search', {
    params: {
      apikey: apiKey,
      q_track: trackTitle,
      f_has_lyrics: true
    }})
    .then(({ data: { message }}) => {
      if(message.header.status_code !== 200) {
        throw new UnqfyError(`Couldn't fetch Track: Status ${message.header.status_code}`);
      }

      return message.body.track_list[0].track;
    })
    .catch((error) => {
      // We might want to do something else here.
      throw error;
    });
};

// https://developer.musixmatch.com/documentation/api-reference/track-lyrics-get
const getTrackLyricsByTrackId = (trackId) => {
  return musixMatch.get('/track.lyrics.get', {
    params: {
      apikey: apiKey,
      track_id: trackId
    }})
    .then(({ data: { message }}) => {
      if(message.header.status_code !== 200) {
        throw new UnqfyError(`Couldn't fetch Track's lyrics: Status ${message.header.status_code}`);
      }

      const lyrics = message.body.lyrics.lyrics_body;
      const commercialUse = '******* This Lyrics is NOT for Commercial use *******';
      const musixMatchInsertedNumber = /\([0-9]*\)/;
      const sanitizedLyrics = lyrics.replace(commercialUse, '').replace(musixMatchInsertedNumber, '').trim();

      return sanitizedLyrics;
    })
    .catch((error) => {
      // We might want to do something else here.
      throw error;
    });
};

const getTrackLyrics = async (trackTitle) => {
  const { track_id } = await getTrackByTitle(trackTitle);
  const trackLyrics = await getTrackLyricsByTrackId(track_id)

  return trackLyrics;
};

module.exports = {
  baseURL,
  apiKey,
  getTrackLyrics,
}
