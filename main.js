const fs = require('fs'); // necesitado para guardar/cargar unqfy
const { get } = require('https');
const UNQfy = require('./src/unqfy'); // importamos el modulo unqfy

const DATA_FILENAME = 'data.json';

const ADD_ARTIST = 'addArtist';
const REMOVE_ARTIST = 'removeArtist';
const ADD_ALBUM = 'addAlbum';
const REMOVE_ALBUM = 'removeAlbum';
const ADD_TRACK = 'addTrack';
const REMOVE_TRACK = 'removeTrack';
const CREATE_PLAYLIST = 'createPlaylist';
const REMOVE_PLAYLIST = 'removePlaylist';
const SEARCH_BY_NAME = 'searchByName';
const TRACKS_BY_ARTIST = 'tracksByArtist';
const TRACKS_BY_GENRES = 'tracksByGenres';
const ALBUMS_BY_ARTIST = 'albumsByArtist';
const ALBUM_TRACKS = 'albumTracks';
const ALL_ARTISTS = 'allArtists';
const ALL_ALBUMS = 'allAlbums';
const ALL_TRACKS = 'allTracks';
const ALL_PLAYLISTS = 'allPlaylists';
const ADD_USER = 'addUser';
const USER_LISTEN_TO = 'userListenTo';
const TRACKS_USER_LISTENED_TO = 'tracksUserListenedTo';
const TIMES_USER_LISTENED_TO = 'timesUserListenedTo';
const CREATE_THIS_IS_LIST = 'createThisIsList';

const validExecutableCommands = [
  ADD_ARTIST,
  REMOVE_ARTIST,
  ADD_ALBUM,
  REMOVE_ALBUM,
  ADD_TRACK,
  REMOVE_TRACK,
  CREATE_PLAYLIST,
  REMOVE_PLAYLIST,
  SEARCH_BY_NAME,
  TRACKS_BY_ARTIST,
  TRACKS_BY_GENRES,
  ALBUMS_BY_ARTIST,
  ALBUM_TRACKS,
  ALL_ARTISTS,
  ALL_ALBUMS,
  ALL_TRACKS,
  ALL_PLAYLISTS,
  ADD_USER,
  USER_LISTEN_TO,
  TRACKS_USER_LISTENED_TO,
  TIMES_USER_LISTENED_TO,
  CREATE_THIS_IS_LIST,
];

const commandsArguments = {
  [ADD_ARTIST]: ['name', 'country'],
  [REMOVE_ARTIST]: ['name'],
  [ADD_ALBUM]: ['name', 'artist', 'year'],
  [REMOVE_ALBUM]: ['artistName', 'albumName'],
  [ADD_TRACK]: ['title', 'album', 'duration', 'genres'],
  [REMOVE_TRACK]: ['albumName', 'trackTitle'],
  [CREATE_PLAYLIST]: ['name', 'genres', 'maxDuration'],
  [REMOVE_PLAYLIST]: ['name'],
  [SEARCH_BY_NAME]: ['name'],
  [TRACKS_BY_ARTIST]: ['artistName'],
  [TRACKS_BY_GENRES]: ['genres'],
  [ALBUMS_BY_ARTIST]: ['artistName'],
  [ALBUM_TRACKS]: ['albumName'],
  [ALL_ARTISTS]: [],
  [ALL_ALBUMS]: [],
  [ALL_TRACKS]: [],
  [ALL_PLAYLISTS]: [],
  [ADD_USER]: ['name'],
  [USER_LISTEN_TO]: ['userName', 'trackTitle'],
  [TRACKS_USER_LISTENED_TO]: ['userName'],
  [TIMES_USER_LISTENED_TO]: ['userName', 'trackTitle'],
  [CREATE_THIS_IS_LIST]: ['artistName'],
}

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy() {
  let unqfy = new UNQfy();

  if (fs.existsSync(DATA_FILENAME)) {
    unqfy = UNQfy.load(DATA_FILENAME);
  }

  return unqfy;
}

function saveUNQfy(unqfy) {
  unqfy.save(DATA_FILENAME);
}

function validateCommand(command) {
  if(!validExecutableCommands.includes(command)) {
    throw new Error(`"${command}" is not a valid command.`);
  }
}

function validateCommandArguments(command, args) {
  const expectedArgs = commandsArguments[command];
  const areAllArgsSupplied = expectedArgs.every((expectedArg) => args.includes(expectedArg));
  const doAllArgsHaveValue = expectedArgs.length * 2 === args.length;

  if(!areAllArgsSupplied) {
    throw new Error(`Not all required arguments were supplied: ${expectedArgs.join(', ')}`);
  }

  if(!doAllArgsHaveValue) {
    throw new Error(`Not all required arguments had a value: ${expectedArgs.join(', ')}`);
  }
}

function fieldValueFromArgs(args, field) {
  const fieldIndex = args.indexOf(field);

  return args[fieldIndex + 1];
}

function numberFieldValueFromArgs(args, field) {
  return parseInt(fieldValueFromArgs(args, field));
}

function arrayFieldValueFromArgs(args, field) {
  return fieldValueFromArgs(args, field).split(",");
}

function serializeArtist({name, country, albums}) {
  return { 
    name, 
    country, 
    albums: albums.map(album => album.name)
  }
}

function serializeAlbum({name, year, tracks}) {
  return { 
    name, 
    year, 
    tracks: tracks.map(track => track.title) 
  }
}

function serializeTrack({title, duration, genres}) {
  return { 
    title, 
    duration, 
    genres 
  }
}

function serializePlaylist(playlist) {
  return { 
    name: playlist.name, 
    tracks: playlist.tracks.map(track => track.title), 
    duration: playlist.duration() 
  }
}

function log(title, object) {
  console.log(`${title}: ${JSON.stringify(object, undefined, 2)}`);
}

function executeCommandWithArgs(unqfy, command, args) {
  validateCommand(command);
  validateCommandArguments(command, args);

  switch(command) {
    case ADD_ARTIST: {
      const name = fieldValueFromArgs(args, 'name');
      const country = fieldValueFromArgs(args, 'country');

      unqfy.addArtist({ name, country });
      break;
    }
    case REMOVE_ARTIST: {
      const artistName = fieldValueFromArgs(args, 'name');
      const artistId = unqfy.getArtistIdByName(artistName);

      unqfy.removeArtist(artistId);
      break;
    }
    case ADD_ALBUM: {
      const name = fieldValueFromArgs(args, 'name');
      const artist = fieldValueFromArgs(args, 'artist');
      const year = fieldValueFromArgs(args, 'year');

      unqfy.addAlbum(unqfy.getArtistIdByName(artist),{name, year});
      break;
    }
    case REMOVE_ALBUM: {
      const artistName = fieldValueFromArgs(args, 'artistName');
      const albumName = fieldValueFromArgs(args, 'albumName');
      const artistId = unqfy.getArtistIdByName(artistName);
      const albumId = unqfy.getAlbumIdByName(albumName);

      unqfy.removeAlbum(artistId, albumId);
      break;
    }
    case ADD_TRACK: {
      const name = fieldValueFromArgs(args, 'title');
      const album = fieldValueFromArgs(args, 'album');
      const duration = numberFieldValueFromArgs(args, 'duration');
      const genres = arrayFieldValueFromArgs(args, 'genres');
  
      unqfy.addTrack(unqfy.getAlbumIdByName(album), {name, duration, genres});
      break;
    }
    case REMOVE_TRACK: {
      const albumName = fieldValueFromArgs(args, 'albumName');
      const trackTitle = fieldValueFromArgs(args, 'trackTitle');
      const albumId = unqfy.getAlbumIdByName(albumName);
      const trackId = unqfy.getTrackIdByTitle(trackTitle);

      unqfy.removeTrack(albumId, trackId);
      break;
    }
    case CREATE_PLAYLIST: {
      const name = fieldValueFromArgs(args, 'name');
      const genres = arrayFieldValueFromArgs(args, 'genres');
      const maxDuration = numberFieldValueFromArgs(args, 'maxDuration');
      
      unqfy.createPlaylist(name, genres, maxDuration);
      break;
    }
    case REMOVE_PLAYLIST: {
      const playlistName = fieldValueFromArgs(args, 'name');
      const playlistId = unqfy.getPlaylistIdByName(playlistName);

      unqfy.removePlaylist(playlistId);
      break;
    }
    case SEARCH_BY_NAME: {
      const name = fieldValueFromArgs(args, 'name');
      const searchResult = unqfy.searchByName(name);
      const serializedSearchResult = {
        artists: searchResult.artists.map(serializeArtist),
        albums: searchResult.albums.map(serializeAlbum),
        tracks: searchResult.tracks.map(serializeTrack),
        playlists: searchResult.playlists.map(serializePlaylist),
      };

      log(`All artists, albums, tracks, and playlists that include "${name}"`, serializedSearchResult);
      break;
    }
    case TRACKS_BY_ARTIST: {
      const artistName = fieldValueFromArgs(args, 'artistName');
      const artistTracks = unqfy.getTracksMatchingArtist(artistName).map(serializeTrack);

      log(`${artistName}'s tracks`, artistTracks);
      break;
    }
    case TRACKS_BY_GENRES: {
      const genres = arrayFieldValueFromArgs(args, 'genres');
      const tracksMatchingGenres = unqfy.getTracksMatchingGenres(genres).map(serializeTrack);

      log(`Tracks that have ${genres} as genre(s)`, tracksMatchingGenres);
      break;
    }
    case ALBUMS_BY_ARTIST: {
      const artistName = fieldValueFromArgs(args, 'artistName');
      const albumsMatchingArtist = unqfy.getAlbumsMatchingArtist(artistName).map(serializeAlbum);

      log(`${artistName}'s albums`, albumsMatchingArtist);
      break;
    }
    case ALBUM_TRACKS: {
      const albumName = fieldValueFromArgs(args, 'albumName');
      const albumTracks = unqfy.getTracksMatchingAlbum(albumName).map(serializeTrack);

      log(`Tracks for "${albumName}" album`, albumTracks);
      break;
    }
    case ALL_ARTISTS: {
      const artists = unqfy.allArtists().map(serializeArtist);

      log('All artists', artists);
      break;
    }
    case ALL_ALBUMS: {
      const albums = unqfy.allAlbums().map(serializeAlbum);

      log('All albums', albums);
      break;
    }
    case ALL_TRACKS: {
      const tracks = unqfy.allTracks().map(serializeTrack);

      log('All tracks', tracks);
      break;
    }
    case ALL_PLAYLISTS: {
      const playlists = unqfy.allPlaylists().map(serializePlaylist);

      log('All playlists', playlists);
      break;
    }
    case ADD_USER: {
      const name = fieldValueFromArgs(args, 'name');

      unqfy.createUser(name);
      break;
    }
    case USER_LISTEN_TO: {
      const userName = fieldValueFromArgs(args, 'userName');
      const trackTitle = fieldValueFromArgs(args, 'trackTitle');

      unqfy.userListenTo(userName, trackTitle);
      break;
    }
    case TRACKS_USER_LISTENED_TO: {
      const userName = fieldValueFromArgs(args, 'userName');
      const tracksUserListenedTo = unqfy.tracksUserListenedTo(userName).map(serializeTrack);

      log(`Tracks ${userName} listened to`, tracksUserListenedTo);
      break;
    }
    case TIMES_USER_LISTENED_TO: {
      const userName = fieldValueFromArgs(args, 'userName');
      const trackTitle = fieldValueFromArgs(args, 'trackTitle');
      const timesUserListenedToTrack = unqfy.timesUserListenedTo(userName, trackTitle);

      log(`Times ${userName} listened to "${trackTitle}"`, timesUserListenedToTrack);
      break;
    }
    case CREATE_THIS_IS_LIST: {
      const artistName = fieldValueFromArgs(args, 'artistName');
      const mostListenedTracksFromArtist = unqfy.createThisIsList(artistName).map(serializeTrack);

      log(`${artistName}'s top 3 listened tracks`, mostListenedTracksFromArtist);
      break;
    }
  }
}

function main() {
  const command = process.argv[2];
  const args = process.argv.splice(3);
  const unqfy = getUNQfy();

  try{
    executeCommandWithArgs(unqfy, command, args);
  } catch(err) {
    console.error(`Error: ${err.message}`);
  }

  saveUNQfy(unqfy);
}

main();
