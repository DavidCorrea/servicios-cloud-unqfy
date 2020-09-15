const Artist = require('./artist');

class ArtistRepository {
  constructor() {
    this.artists = [];
    this.nextId = 0;
  }

  create(name, country) {
    this._validateNameDoesNotExist(name);

    const artist = new Artist(this.nextId++, name, country);
    this.artists.push(artist);

    return artist;
  }

  getById(id) {
    const artist = this.artists.find((artist) => artist.id === id);

    if(!!artist) {
      return artist;
    } else {
      throw new Error(`Couldn't find Artist with ID ${id}`);
    }
  }

  _validateNameDoesNotExist(name) {
    if(this.artists.some((artist) => artist.name === name)) {
      throw new Error("Couldn't create new Artist: Name was already taken");
    }
  }
}

module.exports = ArtistRepository;