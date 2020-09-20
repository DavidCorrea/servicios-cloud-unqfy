const Track = require("./Track");

class Album {
  constructor(id, name, year){
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

  addTrack(trackId, trackTitle, trackDuration, trackGenres) {
    this._validateTitleIsAvailable(trackTitle);

    const track = new Track(trackId,trackTitle,trackDuration,trackGenres);
    this.tracks.push(track);

    return track;
  }

  _validateTitleIsAvailable(title) {
    if (this.tracks.some((track) => track.title === title)) {
      throw new Error("Couldn't create new Track: Title was already taken");
    }
  }
}  

module.exports = Album;
