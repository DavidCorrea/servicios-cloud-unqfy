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

  addAlbum(artistId, { name, year }) {
    this._validateIsNotEmpty(name, 'Album', 'Name');
    this._validateIsNotEmpty(year, 'Album', 'Year');

    const artist = this.getArtistById(artistId);

    return artist.addAlbum(this._nextId(Album), name, year);
  }

  addTrack(albumId, { name, duration, genres }) {
    this._validateIsNotEmpty(name, 'Track', 'Title');
    this._validateIsBiggerThanZero(duration, 'Track', 'Duration');
    this._validateIsNotEmpty(genres, 'Track', 'genres');

    const album = this.getAlbumById(albumId);

    return album.addTrack(this._nextId(Track), name, duration, genres);
  }

  getArtistById(id) {
    const artist = this.artists.find((artist) => artist.id === id);
    this._validateIfExist(artist, 'Artist');

    return artist;
  }

  getArtistByName(name){
    return this.artists.find((artist) => artist.name === name);
  }

  getArtistIdByName(name){
    const artist = this.getArtistByName(name);
    this._validateIfExist(artist, 'Artist');

    return artist.id;
  }

  getAlbumById(id) {
    const album = this.allAlbums().find((album => album.id === id));
    this._validateIfExist(album, 'Album');

    return album;
  }

  getAlbumIdByName(name){
    const album = this.allAlbums().find((album => album.name === name));
    this._validateIfExist(album, 'Album');

    return album.id;
  }

  getTrackById(id) {
    const track = this.allTracks().find((track => track.id === id));
    this._validateIfExist(track, 'Track');

    return track;
  }

  getTrackIdByTitle(title) {
    const track = this.allTracks().find((track => track.title === title));
    this._validateIfExist(track, 'Track');

    return track.id;
  }

  getPlaylistIdByName(name){
    const playlist = this.playlists.find((playlist => playlist.name === name));
    this._validateIfExist(playlist, 'Playlist');

    return playlist.id;
  }

  searchByName(name){
    const allArtists = this.artists;
    const allAlbums = this.allAlbums();
    const allTracks = allAlbums.reduce((acum, current) => acum.concat(current.tracks),[]);
    const allPlaylist = this.playlists;

    return {
        artists: allArtists.filter((artist) => artist.name.includes(name)),
        albums: allAlbums.filter((album) => album.name.includes(name)),
        tracks: allTracks.filter((track) => track.title.includes(name)),
        playlists: allPlaylist.filter((playlist) => playlist.name.includes(name)),
    }
  }
  
  allArtists(){
    return this.artists;
  }
  
  allAlbums() {
    return this._flatMap(this.artists.map(artist => artist.albums));
  }

  allTracks() {
    return this._flatMap(this.artists.map(artist => artist.allTracks()));
  }

  allPlaylists(){
    return this.playlists;
  }

  getTracksMatchingGenres(genresToInclude) {
    return this.allTracks().filter(track => track.belongsToGenres(genresToInclude));
  }

  getTracksMatchingArtist(artistName) {
      return this.getArtistByName(artistName).allTracks();
  }

  removeArtist(artistId) {
    const artistToRemove = this.getArtistById(artistId);

    this._removeTracksFromAllPlaylists(artistToRemove.allTracks());
    this.artists = this.artists.filter((artist) => artist.id !== artistToRemove.id);
  }

  removeAlbum(artistId, albumId) {
    const artist = this.getArtistById(artistId);
    const album = this.getAlbumById(albumId);

    this._removeTracksFromAllPlaylists(album.tracks);
    artist.removeAlbum(album);
  }

  removeTrack(albumId, trackId) {
    const album = this.getAlbumById(albumId);
    const track = this.getTrackById(trackId);

    this._removeTracksFromAllPlaylists([track]);
    album.removeTrack(track);
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

  removePlaylist(playlistIdToRemove){
    this.playlists = this.playlists.filter(playlist => playlist.id !== playlistIdToRemove);
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

  _getRandomTracksMatchingGenres(genresToInclude) {
    return this.getTracksMatchingGenres(genresToInclude).sort(() => Math.random() - 0.5);
  }

  _removeTracksFromAllPlaylists(tracks) {
    this.playlists.forEach((playlist) => playlist.removeTracks(tracks));
  }

  _flatMap(arrayOfArrays) {
    return arrayOfArrays.reduce((all, array) => all.concat(array), []);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = UNQfy;
