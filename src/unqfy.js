const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const { flatMap, firstN } = require('./lib');
const UnqfyError = require('./UnqfyError');
const Artist = require('./Artist');
const Album = require('./Album');
const Track = require('./Track');
const Playlist = require('./Playlist');
const User = require('./User');
const Reproduction = require('./Reproduction');
const Spotify = require('./SpotifyClient');

class UNQfy {
  constructor() {
    this.ids = {}
    this.artists = [];
    this.playlists = [];
    this.users = [];
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
    const artist = this.artists.find((artist) => artist.name === name);
    this._validateIfExist(artist, 'Artist');

    return artist;
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

  getAlbumByName(name) {
    const album = this.allAlbums().find((album => album.name === name));
    this._validateIfExist(album, 'Album');

    return album;
  }

  getTrackById(id) {
    const track = this.allTracks().find((track => track.id === id));
    this._validateIfExist(track, 'Track');

    return track;
  }

  getTrackIdByTitle(title) {
    return this._getTrackByTitle(title).id;
  }

  getPlaylistIdByName(name){
    const playlist = this.playlists.find((playlist => playlist.name === name));
    this._validateIfExist(playlist, 'Playlist');

    return playlist.id;
  }

  searchByName(name){
    const allArtists = this.artists;
    const allAlbums = this.allAlbums();
    const allTracks = this.allTracks();
    const allPlaylist = this.playlists;

    return {
      artists: allArtists.filter((artist) => artist.name.toLowerCase().includes(name.toLowerCase())),
      albums: allAlbums.filter((album) => album.name.includes(name)),
      tracks: allTracks.filter((track) => track.title.includes(name)),
      playlists: allPlaylist.filter((playlist) => playlist.name.includes(name)),
    }
  }
  
  allArtists(){
    return this.artists;
  }
  
  allAlbums() {
    return flatMap(this.artists.map(artist => artist.albums));
  }

  allTracks() {
    return flatMap(this.artists.map(artist => artist.allTracks()));
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

  getAlbumsMatchingArtist(artistName) {
    return this.getArtistByName(artistName).albums;
  }

  getTracksMatchingAlbum(albumName) {
    return this.getAlbumByName(albumName).tracks;
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

    const playlist = Playlist.fromTracks(this._nextId(Playlist), name, this.getTracksMatchingGenres(genresToInclude), maxDuration);
    this.playlists.push(playlist);

    return playlist;
  }

  removePlaylist(playlistIdToRemove){
    this.playlists = this.playlists.filter(playlist => playlist.id !== playlistIdToRemove);
  }

  createUser(name) {
    this._validateIsNotEmpty(name, 'User', 'Name');
    this._validateUserNameIsAvailable(name);
    
    const user = new User(this._nextId(User), name);
    this.users.push(user);

    return user;
  }

  userListenTo(userName, trackTitle) {
    const user = this._getUserByName(userName);
    const track = this._getTrackByTitle(trackTitle);

    user.addReproduction(new Reproduction(this._nextId(Reproduction), track));
  }

  tracksUserListenedTo(userName) {
    return this._getUserByName(userName).listenedTracks();
  }

  timesUserListenedTo(userName, trackTitle) {
    const user = this._getUserByName(userName);
    const track = this._getTrackByTitle(trackTitle);

    return user.timesTrackWasListened(track);
  }

  createThisIsList(artistName) {
    const artist = this.getArtistByName(artistName);
    const artistTracksSortedByTimesListened = this._artistTracksSortedByTimesListened(artist);

    return firstN(artistTracksSortedByTimesListened, 3);
  }

  async populateAlbumsForArtist(artistName) {
    const artist = this.getArtistByName(artistName);
    const artistAlbums = await Spotify.getArtistAlbums(artistName);

    artistAlbums.forEach((artistAlbum) => this.addAlbum(artist.id, { name: artistAlbum.name, year: artistAlbum.releaseYear }));
  }

  async trackLyrics(trackTitle) {
    const track = this._getTrackByTitle(trackTitle);

    return await track.getLyrics();
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [UNQfy, Artist, Album, Track, Playlist, User, Reproduction];

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
      throw new UnqfyError(`Couldn't create new ${errorMessageClass}: ${errorMessageParameter} cannot be empty`);
    }
  }

  _validateNameIsAvailable(name) {
    if (this.artists.some((artist) => artist.name === name)) {
      throw new UnqfyError("Couldn't create new Artist: Name was already taken");
    }
  }

  _validatePlaylistNameIsAvailable(name) {
    if (this.playlists.some((playlist) => playlist.name === name)) {
      throw new UnqfyError("Couldn't create new Playlist: Name was already taken");
    }
  }

  _validateUserNameIsAvailable(name) {
    if (this.users.some((user) => user.name === name)) {
      throw new UnqfyError("Couldn't create new User: Name was already taken");
    }
  }
  
  _validateIfExist(value, errorMessage) {
    if (!value) {
      throw new UnqfyError(`${errorMessage} does not exist`);
    }
  }

  _validateIsBiggerThanZero(value, errorMessageClass, errorMessageParameter) {
    if (value < 1) {
      throw new UnqfyError(`Couldn't create new ${errorMessageClass}: ${errorMessageParameter} must be bigger than zero`);
    }
  }

  _getUserByName(name) {
    const user = this.users.find((user) => user.name === name);
    this._validateIfExist(user, 'User');

    return user;
  }

  _getTrackByTitle(title) {
    const track = this.allTracks().find((track => track.title === title));
    this._validateIfExist(track, 'Track');

    return track;
  }

  _removeTracksFromAllPlaylists(tracks) {
    this.playlists.forEach((playlist) => playlist.removeTracks(tracks));
  }

  _artistTracksSortedByTimesListened(artist) {
    const artistTracks = artist.allTracks();

    const tracksListenings = artistTracks.map((artistTrack) => {
      const timesUsersListenedToTrack = this.users.reduce((timesUsersListened, user) => {
        return timesUsersListened + user.timesTrackWasListened(artistTrack);        
      }, 0);

      return {
        track: artistTrack,
        timesListened: timesUsersListenedToTrack
      }
    });

    tracksListenings.sort((trackListenings, anotherTrackListenings) => {
      if (trackListenings.timesListened > anotherTrackListenings.timesListened) {
        return -1;
      } else if (trackListenings.timesListened < anotherTrackListenings.timesListened) {
        return 1;
      } else {
        return 0;
      }
    });

    return tracksListenings.map(trackListenings => trackListenings.track);
  }
}

module.exports = UNQfy;
