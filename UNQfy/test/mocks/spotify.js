const nock = require('nock');
const { baseURL } = require('../../src/clients/SpotifyClient')

const mockSuccessfulArtistSearchRequest = (artistName, spotifyArtistId) => {
  nock(baseURL)
    .get('/search')
    .query({ type: 'artist', q: artistName })
    .reply(200, { 
      artists: {
        items: [ { id: spotifyArtistId } ]
      }
    });
};          

const mockUnsuccessfulArtistSearchRequest = (artistName, httpStatus, errorMessage) => {
  nock(baseURL)
    .get('/search')
    .query({ type: 'artist', q: artistName })
    .reply(httpStatus, { 
      error: {
        status: httpStatus,
        message: errorMessage
      }
    });
};

const mockSuccessfulArtistAlbumsRequest = (spotifyArtistId, artistAlbums) => {
  nock(baseURL)
    .get(`/artists/${spotifyArtistId}/albums`)
    .reply(200, { 
        items: artistAlbums
    });
};

const mockUnsuccessfulArtistAlbumsRequest = (spotifyArtistId, httpStatus, errorMessage) => {
  nock(baseURL)
    .get(`/artists/${spotifyArtistId}/albums`)
    .reply(httpStatus, { 
      error: {
        status: httpStatus,
        message: errorMessage
      }
    });
};

module.exports = {
  mockSuccessfulArtistSearchRequest,
  mockUnsuccessfulArtistSearchRequest,
  mockSuccessfulArtistAlbumsRequest,
  mockUnsuccessfulArtistAlbumsRequest
};
