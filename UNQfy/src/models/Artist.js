const { flatMap } = require('../lib/lib');
const { ResourceAlreadyExistsError } = require('./UnqfyError');
const Album = require('./Album');
const Observable = require('./Observable');
const NewsletterClient = require('../clients/NewsletterClient');

class Artist extends Observable {
  constructor(id, name, country){
    super();

    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];

    this.addObserver(new NewsletterClient());
  }

  propsToSerialize() {
    return ['id', 'name', 'country', 'albums'];
  }

  async addAlbum(albumId, albumName, albumYear) {
    this._validateNameIsAvailable(albumName);

    const album = new Album(albumId, albumName, albumYear);
    this.albums.push(album);
    // ¿Sería mejor hacer esto sin el await?
    await this._notify(albumName);

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
      throw new ResourceAlreadyExistsError('Album', 'Name');
    }
  }
}

module.exports = Artist;
