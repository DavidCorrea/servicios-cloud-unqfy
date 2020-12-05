const MusixMatch = require('../clients/MusixMatchClient');

class Track {
  constructor(id, title, duration, genres){
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.genres = genres;
    this.lyrics = '';
  }

  belongsToGenres(genresToInclude) {
    return genresToInclude.some(genreToInclude => this.genres.includes(genreToInclude));
  }

  async getLyrics() {
    if(!this.lyrics) {
      this.lyrics = await MusixMatch.getTrackLyrics(this.title);
    }   

    return this.lyrics;
  }

  // We return the same object to keep the objects' serialization consistent.
  serialize() {
    return this;
  }
}  

module.exports = Track;
