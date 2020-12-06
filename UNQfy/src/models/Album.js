const { ResourceAlreadyExistsError } = require('./UnqfyError');
const Track = require("./Track");
const Observable = require('./Observable');
const LoggingClient = require('../clients/LoggingClient');

class Album extends Observable {
  constructor(id, name, year){
    super();

    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];

    this.addObserver(new LoggingClient());
  }

  propsToSerialize() {
    return ['id', 'name', 'year', 'tracks'];
  }

  addTrack(trackId, trackTitle, trackDuration, trackGenres) {
    this._validateTitleIsAvailable(trackTitle);

    const track = new Track(trackId, trackTitle, trackDuration, trackGenres);
    this.tracks.push(track);
    this._notify({ action: 'add', object: track });

    return track;
  }

  hasTrack(track) {
    return this.tracks.includes(track);
  }

  removeTrack(trackToRemove) {
    this.tracks = this.tracks.filter(track => track.id !== trackToRemove.id);
    this._notify({ action: 'remove', object: trackToRemove });
  }

  serialize({ deep = false } = {}) {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      tracks: this.tracks.map(track => deep ? track.serialize() : track.title)
    }
  }

  _validateTitleIsAvailable(title) {
    if (this.tracks.some(track => track.title === title)) {
      throw new ResourceAlreadyExistsError('Track', 'Title');
    }
  }
}  

module.exports = Album;
