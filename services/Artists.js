const UNQfy = require('../src/unqfy');
const unqfy = new UNQfy();

class ArtistsService {

     getArtistByName(name) {
        return unqfy.getArtistByName(name);
    }
}

module.exports = ArtistsService;