const nock = require('nock');

const mockSuccessfulArtistSearchRequest = (artistName, spotifyArtistId) => {
  nock('https://api.spotify.com/v1')
    .get('/search')
    .query({ type: 'artist', q: artistName })
    .reply(200, { 
      artists: {
        items: [ { id: spotifyArtistId } ]
      }
    });
};          

const mockUnsuccessfulArtistSearchRequest = (artistName, httpStatus, errorMessage) => {
  nock('https://api.spotify.com/v1')
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
  nock('https://api.spotify.com/v1')
    .get(`/artists/${spotifyArtistId}/albums`)
    .reply(200, { 
        items: artistAlbums
    });
};

const mockUnsuccessfulArtistAlbumsRequest = (spotifyArtistId, httpStatus, errorMessage) => {
  nock('https://api.spotify.com/v1')
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
