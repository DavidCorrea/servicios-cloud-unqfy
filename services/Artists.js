const UNQfy = require('../src/unqfy');
const util = require('util');

class ArtistsService { // Clase estática
    
    static async getArtistByName(name) {
        return util.promisfy(UNQfy.getArtistByName(name));
    }
}

module.exports = ArtistsService;