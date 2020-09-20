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

  allTracks() {
    return this.albums.map(album => album.tracks).reduce((artistTracks, albumTracks) => artistTracks.concat(albumTracks), []);
  }

  _validateNameIsAvailable(name) {
    if (this.albums.some((album) => album.name === name)) {
      throw new Error("Couldn't create new Album: Name was already taken");
    }
  }
}  

module.exports = Artist;
