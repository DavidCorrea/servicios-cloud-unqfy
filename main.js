

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const { get } = require('https');
const UNQfy = require('./src/unqfy'); // importamos el modulo unqfy

const DATA_FILENAME = 'data.json';
const ADD_ARTIST = 'addArtist';
const GET_ARTIST = 'getArtist';
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

const validExecutableCommands = [
  ADD_ARTIST,
  GET_ARTIST,
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
];

const commandsArguments = {
  [ADD_ARTIST]: ['name', 'country'],
  [GET_ARTIST]: ['id'],
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
    case GET_ARTIST: {
      const artistId = numberFieldValueFromArgs(args, 'id');
      const artist = unqfy.getArtistById(artistId);

      console.log(artist);
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

      console.log( unqfy.searchByName(name));
      break;
    }
    case TRACKS_BY_ARTIST: {
      const artistName = fieldValueFromArgs(args, 'artistName');

      console.log(unqfy.getTracksMatchingArtist(artistName));
      break;
    }
    case TRACKS_BY_GENRES: {
      const genres = arrayFieldValueFromArgs(args, 'genres');

      console.log(unqfy.getTracksMatchingGenres(genres))
      break;
    }
  }
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)
*/
function main() {
  const command = process.argv[2];
  const args = process.argv.splice(3);
  const unqfy = getUNQfy();

  executeCommandWithArgs(unqfy, command, args);
  saveUNQfy(unqfy);
}

main();
