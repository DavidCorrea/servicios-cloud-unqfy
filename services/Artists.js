const UNQfy = require('../src/unqfy');

class ArtistsService {

     getArtistByName(name) {
        const unqfy = new UNQfy();
        return unqfy.getArtistByName(name);
    }
}

module.exports = ArtistsService;