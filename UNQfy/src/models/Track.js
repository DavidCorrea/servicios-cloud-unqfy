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

  // We return a new object with the same values to keep the objects' serialization consistent.
  serialize() {
    return {
      id: this.id,
      title: this.title,
      duration: this.duration,
      genres: this.genres,
      lyrics: this.lyrics
    };
  }
}  

module.exports = Track;
