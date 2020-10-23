const axios = require('axios');
const spotifyCreds = require('../spotifyCreds');

const spotify = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    Authorization: `Bearer ${spotifyCreds.access_token}`
  }
});

// https://developer.spotify.com/documentation/web-api/reference-beta/#category-search
const getArtistByName = (artistName) => {
  return spotify.get('/search', {
    params: {
      type: 'artist',
      q: artistName
    }})
    .then((response) => {
      return response.data.artists.items[0];
    })
    .catch((error) => {
      console.log(error.response.data.error);
    });
};


https://developer.spotify.com/documentation/web-api/reference-beta/#category-albums
const getArtistAlbums = (artistId) => {
  return spotify.get(`/artists/${artistId}/albums`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response.data.error);
    });
};

getArtistByName('Deadmau5').then(({ id }) => {
  getArtistAlbums(id).then((artistAlbums) => {
    console.log(artistAlbums.items);
  });
});
