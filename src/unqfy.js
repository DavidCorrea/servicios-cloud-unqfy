const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./Artist');
const Album = require('./Album');
const Track = require('./Track');
const Playlist = require('./Playlist');

class UNQfy {
  constructor() {
    this.ids = {}
    this.artists = [];
    this.playlists = [];
  }

  addArtist({ name, country }) {
    this._validateIsNotEmpty(name, 'Artist', 'Name');
    this._validateIsNotEmpty(country, 'Artist', 'Country');
    this._validateNameIsAvailable(name);

    const artist = new Artist(this._nextId(Artist), name, country);
    this.artists.push(artist);

    return artist;
  }

  addAlbum(artistId, albumData) {
    this._validateIsNotEmpty(albumData.name, 'Album', 'Name');
    this._validateIsNotEmpty(albumData.year, 'Album', 'Year');

    const artist = this.getArtistById(artistId)
    this._validateIfExist(artist, 'Artist');

    return artist.addAlbum(this._nextId(Album), albumData.name, albumData.year);
  }

  addTrack(albumId, trackData) {
    this._validateIsNotEmpty(trackData.name, 'Track', 'Title');
    this._validateIsNotEmpty(trackData.duration, 'Track', 'Duration');
    this._validateIsNotEmpty(trackData.genres, 'Track', 'genres');

    const album = this.getAlbumById(albumId)
    this._validateIfExist(album, 'Album');

    return album.addTrack(this._nextId(Track),trackData.name,trackData.duration, trackData.genres)
  }

  getArtistById(id) {
    return this.artists.find((artist) => artist.id === id);
  }

  getArtistIdByName(name){
    return this.artists.find((artist) => artist.name === name).id;
  }

  getAlbumById(id) {
    return this.artists.reduce((acum, current) => acum.concat(current.albums),[]).find((album => album.id === id));
  }

  getAlbumIdByName(name){
    return this.artists.reduce((acum, current) => acum.concat(current.albums),[]).find((album => album.name === name)).id;
  }

  getTrackById(id) {

  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }

  createPlaylist(name, genresToInclude, maxDuration) {
    this._validateIsNotEmpty(name, 'Playlist', 'Name');
    this._validateIsNotEmpty(genresToInclude, 'Playlist', 'Genres');
    this._validateIsBiggerThanZero(maxDuration, 'Playlist', 'Max duration');
    this._validatePlaylistNameIsAvailable(name);

    const tracks = [];
    let duration = 0;

    this._getRandomTracksMatchingGenres(genresToInclude).forEach((track) => {
      if ((duration + track.duration) <= maxDuration) {
        duration += track.duration;
        tracks.push(track);
      }
    });

    const playlist = new Playlist(this._nextId(Playlist), name, tracks);
    this.playlists.push(playlist);

    return playlist;
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

  _nextId(clazz) {
    const className = clazz.name;
    const currentId = this.ids[className];
    const nextId = currentId || 0;
    this.ids[className] = nextId + 1;

    return nextId;
  }

  _validateIsNotEmpty(value, errorMessageClass, errorMessageParameter) {
    if (value.length === 0) {
      throw new Error(`Couldn't create new ${errorMessageClass}: ${errorMessageParameter} cannot be empty`);
    }
  }

  _validateNameIsAvailable(name) {
    if (this.artists.some((artist) => artist.name === name)) {
      throw new Error("Couldn't create new Artist: Name was already taken");
    }
  }

  _validatePlaylistNameIsAvailable(name) {
    if (this.playlists.some((playlist) => playlist.name === name)) {
      throw new Error("Couldn't create new Playlist: Name was already taken");
    }
  }
  
  _validateIfExist(value, errorMessage) {
    if (!value) {
      throw new Error(`${errorMessage} does not exist`);
    }
  }

  _validateIsBiggerThanZero(value, errorMessageClass, errorMessageParameter) {
    if (value < 1) {
      throw new Error(`Couldn't create new ${errorMessageClass}: ${errorMessageParameter} must be bigger than zero`);
    }
  }

  _allTracks() {
    return this.artists.map(artist => artist.allTracks()).reduce((allTracks, artistTracks) => allTracks.concat(artistTracks), []);
  }

  _getRandomTracksMatchingGenres(genresToInclude) {
    const allTracksForGenres = this._allTracks().filter(track => track.belongsToGenres(genresToInclude));

    return allTracksForGenres.sort(() => Math.random() - 0.5);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = UNQfy;
