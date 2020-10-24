const axios = require('axios');
const spotifyCreds = require('../spotifyCreds');
const UnqfyError = require('./UnqfyError');

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
      // Keeping only the first match since there might be many artists with a similar name.
      return response.data.artists.items[0];
    })
    .catch((error) => {
      throw new UnqfyError(`Couldn't fetch Artist: ${error.response.data.error.message}`);
    });
};


// https://developer.spotify.com/documentation/web-api/reference-beta/#category-albums
const getAlbumsByArtistId = (artistId) => {
  return spotify.get(`/artists/${artistId}/albums`)
    .then((response) => {
      const artistAlbums = response.data.items;

      // Response might have albums with same names but different available markets (See docs for what this value means).
      const uniqueArtistAlbums = artistAlbums.reduce((uniqueArtistAlbums, artistAlbum) => {
        const uniqueArtistAlbumsNames = uniqueArtistAlbums.map(artistAlbum => artistAlbum.name);
        const albumsAlreadyExists = uniqueArtistAlbumsNames.includes(artistAlbum.name);
  
        if(!albumsAlreadyExists) { uniqueArtistAlbums.push(artistAlbum); }
  
        return uniqueArtistAlbums;
      }, []);

      // Simplify release data by only keeping the year.
      uniqueArtistAlbums.forEach((artistAlbum) => artistAlbum.releaseYear = artistAlbum.release_date.match(/(?<year>.*?)-/).groups.year);
  
      return uniqueArtistAlbums;
    })
    .catch((error) => {
      throw new UnqfyError(`Couldn't fetch Artist's albums: ${error.response.data.error.message}`);
    });
};

const getArtistAlbums = async (artistName) => {
  const { id } = await getArtistByName(artistName);
  const artistAlbums = await getAlbumsByArtistId(id);

  return artistAlbums;
};

module.exports = {
  getArtistAlbums
};
