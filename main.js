

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const { get } = require('https');
const UNQfy = require('./src/unqfy'); // importamos el modulo unqfy

const DATA_FILENAME = 'data.json';
const ADD_ARTIST = 'addArtist';
const GET_ARTIST = 'getArtist';
const validExecutableCommands = [ADD_ARTIST, GET_ARTIST];

const commandsArguments = {
  [ADD_ARTIST]: ['name', 'country'],
  [GET_ARTIST]: ['id']
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

function executeCommandWithArgs(unqfy, command, args) {
  validateCommand(command);
  validateCommandArguments(command, args);

  if(command === ADD_ARTIST){
    const name = fieldValueFromArgs(args, 'name');
    const country = fieldValueFromArgs(args, 'country');

    unqfy.addArtist({ name, country });
  }

  if(command === GET_ARTIST){
    const artistId = fieldValueFromArgs(args, 'id');
    const artist = unqfy.getArtistById(parseInt(artistId));

    console.log(artist);
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
