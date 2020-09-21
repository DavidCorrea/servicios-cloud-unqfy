# UNQfy

## Requerimientos
- Node (14.4.0)

## Instalación
- Clonar el repositorio
- `npm install`

## Comandos (Proyecto)
- Para correr los tests: `npm run test`
- Para correr el linter: `npm run lint`

## Comandos (UNQfy)
| Command               | Arguments                                                               |
| ----------------------|:-----------------------------------------------------------------------:|
| addArtist             | name (String), country (String)                                         |
| removeArtist          | name (String)                                                           |
| addAlbum              | name (String), artist (String), year (Number)                           |
| removeAlbum           | artistName (String), albumName (String)                                 |
| addTrack              | title (String), album (String), duration (Number), genres (List String) |
| removeTrack           | albumName (String), trackTitle (String)                                 |
| createPlaylist        | name (String), genres (List String), maxDuration (Number)               |
| removePlaylist        | name (String)                                                           |
| searchByName          | name (String)                                                           |
| tracksByArtist        | artistName (String)                                                     |
| tracksByGenres        | genres (List String)                                                    |
| albumsByArtist        | artistName (String)                                                     |
| albumTracks           | albumName (String)                                                      |
| allArtists            |                                                                         |
| allAlbums             |                                                                         |
| allTracks             |                                                                         |
| allPlaylists          |                                                                         |
| addUser               | name (String)                                                           |
| userListenTo          | userName (String), trackTitle (String)                                  |
| timesUserListenedTo   | userName (String), trackTitle (String)                                  |

## Set de pruebas desde consola 
```
node main.js addArtist name "Artista1" country "Countr1"

node main.js addAlbum name "Album1" artist "Artista1" year "2020"

node main.js addTrack title "Track1" album "Album1" duration "200" genres "Pop,Rock"

node main.js createPlaylist name "My Playlist" maxDuration 100 genres "Pop"

node main.js removeTrack albumName "Album1" trackTitle "Track1"

node main.js removeAlbum artistName "Artista1" albumName "Album1"

node main.js removeArtist name "Artista1"

node main.js removePlaylist name "My Playlist"

node main.js searchByName name "a"

node main.js tracksByArtist artistName "Artista1"

node main.js tracksByGenres genres "Pop"

node main.js albumsByArtist artistName "Artista1"

node main.js albumTracks albumName "Album1"

node main.js allArtists

node main.js allAlbums

node main.js allTracks

node main.js allPlaylists
```

## Script que popula y realiza operaciones varias.
- `./runUnqfy.sh` (Probablemente haya que darle permisos con `chmod +rx runUnqfy.sh`)

## Visados
- [Visado 1](https://docs.google.com/document/d/1Tfkl6l1_ly4FybquDjTqMHa5gdmrYgvvZpXZaneRFvA/edit?usp=sharing)

## UML
![UML](https://user-images.githubusercontent.com/32984697/93656451-faa0af00-fa00-11ea-801f-a3c8251ef998.PNG)

---
###### Goffredo, Gastón - Correa, David
###### UNQ 2020 S2 - Servicios Cloud - UNQfy
