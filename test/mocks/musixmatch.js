const nock = require('nock');
const { baseURL, apiKey } = require('../../src/MusixMatchClient')

const mockSuccessfulTrackSearchRequest = (trackTitle, musixMatchTrackId) => {
  nock(baseURL)
    .get('/track.search')
    .query({ q_track: trackTitle, f_has_lyrics: true, apikey: apiKey })
    .reply(200, {
      message: {
        header: {
          status_code: 200
        },
        body: {
          track_list: [
            {
              track: {
                track_id: musixMatchTrackId
              }
            }
          ]
        }
      }
    });
};          

const mockUnsuccessfulTrackSearchRequest = (trackTitle, httpStatus) => {
  nock(baseURL)
    .get('/track.search')
    .query({ q_track: trackTitle, f_has_lyrics: true, apikey: apiKey })
    .reply(200, { 
      message: {
        header: {
          status_code: httpStatus
        }
      }
    });
};

const mockSuccessfulTrackLyricsRequest = (musixMatchTrackId, trackLyrics) => {
  nock(baseURL)
    .get('/track.lyrics.get')
    .query({ track_id: musixMatchTrackId, apikey: apiKey })
    .reply(200, { 
      message: {
        header: {
          status_code: 200
        },
        body: {
          lyrics: {
            lyrics_body: trackLyrics
          }
        }
      }
    });
};

const mockUnsuccessfulTrackLyricsRequest = (musixMatchTrackId, httpStatus) => {
  nock(baseURL)
    .get('/track.lyrics.get')
    .query({ track_id: musixMatchTrackId, apikey: apiKey })
    .reply(200, { 
      message: {
        header: {
          status_code: httpStatus
        }
      }
    });
};

module.exports = {
  mockSuccessfulTrackSearchRequest,
  mockUnsuccessfulTrackSearchRequest,
  mockSuccessfulTrackLyricsRequest,
  mockUnsuccessfulTrackLyricsRequest
};
