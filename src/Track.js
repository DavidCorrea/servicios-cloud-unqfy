class Track {
  constructor(id, title, duration, genres){
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.genres = genres;
  }

  belongsToGenres(genresToInclude) {
    return genresToInclude.some(genreToInclude => this.genres.includes(genreToInclude));
  }
}  

module.exports = Track;
