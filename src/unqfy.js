const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist');
const Album = require('./album');
const Track = require('./track');

class UNQfy {
  constructor() {
    this.ids = {}
    this.artists = [];
  }

  addArtist({ name, country }) {
    this._validateIsNotEmpty(name, 'Artist', 'Name');
    this._validateIsNotEmpty(country, 'Artist', 'Country');
    this._validateNameIsAvailable(name);

    const artist = new Artist(this._nextId(Artist), name, country);
    this.artists.push(artist);

    return artist;
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    this._validateIsNotEmpty(albumData.name, 'Album', 'Name');
    this._validateIsNotEmpty(albumData.year, 'Album', 'Year');

    const artist = this.getArtistById(artistId)
    this._validateIfExist(artist, 'Artist');

    return artist.addAlbum(this._nextId(Album), albumData.name, albumData.year);
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
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
    return this._getAllAlbums().find((album => album.id === id));
  }

  getAlbumIdByName(name){
    return this._getAllAlbums().find((album => album.name === name)).id;
  }

  getTrackById(id) {

  }

  getPlaylistById(id) {

  }

  searchByName(name){
    const allArtists = this.artists;
    const allAlbums = this._getAllAlbums();
    const allTracks = allAlbums.reduce((acum, current) => acum.concat(current.tracks),[]);
    //const allPlaylist = this.getPlaylistById;

    return {
        artists: allArtists.filter((artist) => artist.name.includes(name)),
        albums: allAlbums.filter((album) => album.name.includes(name)),
        tracks: allTracks.filter((track) => track.title.includes(name)),
        //playlists: allPlaylist.filter((playlist) => playlist.name.includes(name))
    }
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres2) {
    const allAlbums = this._getAllAlbums();
    const allTracks = allAlbums.reduce((acum, current) => acum.concat(current.tracks),[]);

    return allTracks.filter((track) => track.genres.filter(x => genres2.includes(x)).length > 0)
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track];
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
  
  _validateIfExist(value, errorMessage) {
    if (!value) {
      throw new Error(`${errorMessage} does not exist`);
    }
  }

  _getAllAlbums() {
    return this.artists.reduce((acum, current) => acum.concat(current.albums), []);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = UNQfy;
