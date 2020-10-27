const { flatMap } = require('../lib/lib');
const UnqfyError = require('./UnqfyError');
const Album = require('./Album');

class Artist {
  constructor(id, name, country){
    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];
  }

  addAlbum(albumId, albumName, albumYear) {
    this._validateNameIsAvailable(albumName);

    const album = new Album(albumId,albumName,albumYear);
    this.albums.push(album);

    return album;
  }

  hasAlbum(album) {
    return this.albums.includes(album);
  }

  removeAlbum(albumToRemove) {
    this.albums = this.albums.filter(album => album.id !== albumToRemove.id);
  }

  allTracks() {
    return flatMap(this.albums.map(album => album.tracks));
  }

  ownsTrack(track) {
    return this.allTracks().includes(track);
  }

  _validateNameIsAvailable(name) {
    if (this.albums.some((album) => album.name === name)) {
      throw new UnqfyError("Couldn't create new Album: Name was already taken");
    }
  }
}

module.exports = Artist;