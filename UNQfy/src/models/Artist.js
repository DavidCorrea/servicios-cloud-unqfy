const { flatMap } = require('../lib/lib');
const { ResourceAlreadyExistsError } = require('./UnqfyError');
const Album = require('./Album');
const Observable = require('./Observable');
const NewsletterClient = require('../clients/NewsletterClient');
const LoggingClient = require('../clients/LoggingClient');

class Artist extends Observable {
  constructor(id, name, country){
    super();

    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];

    this.addObserver(new NewsletterClient());
    this.addObserver(new LoggingClient());
  }

  propsToSerialize() {
    return ['id', 'name', 'country', 'albums'];
  }

  addAlbum(albumId, albumName, albumYear) {
    this._validateNameIsAvailable(albumName);

    const album = new Album(albumId, albumName, albumYear);
    this.albums.push(album);
    this._notify({ action: 'add', object: album });

    return album;
  }

  hasAlbum(album) {
    return this.albums.includes(album);
  }

  removeAlbum(albumToRemove) {
    this.albums = this.albums.filter(album => album.id !== albumToRemove.id);
    this._notify({ action: 'remove', object: albumToRemove });
  }

  allTracks() {
    return flatMap(this.albums.map(album => album.tracks));
  }

  ownsTrack(track) {
    return this.allTracks().includes(track);
  }

  serialize({ deep = false } = {}) {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      albums: this.albums.map(album => deep ? album.serialize({ deep }) : album.name)
    }
  }

  _validateNameIsAvailable(name) {
    if (this.albums.some((album) => album.name === name)) {
      throw new ResourceAlreadyExistsError('Album', 'Name');
    }
  }
}

module.exports = Artist;
