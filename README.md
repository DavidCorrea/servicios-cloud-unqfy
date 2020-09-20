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
- `addArtist name "NAME" country "COUNTRY"`
- `getArtist id ID`
- `removeArtist name "ARTIST_NAME"`
- `addAlbum name "NAME" artist "ARTIST_NAME" year YEAR`
- `removeAlbum artistName "ARTIST_NAME" albumName "ALBUM_NAME"`
- `addTrack title "TITLE" album "ALBUM_NAME" duration DURATION_IN_SECONDS genres "GENRE_1,GENRE_2"`
- `removeTrack albumName "ALBUM_NAME" trackTitle "TRACK_TITLE"`
- `createPlaylist name "NAME" genres "GENRE_1,GENRE_2" maxDuration MAX_DURATION_IN_SECONDS`
- `removePlaylist name "NAME"`
- `searchByName name "NAME"`
- `tracksByArtist artistName "ARTIST_NAME"`

## Set de pruebas desde consola 
- `node main.js addArtist name "Artista1" country "Countr1"`
- `node main.js addAlbum name "Album1" artist "Artista1" year "2020"`
- `node main.js addTrack title "Track1" album "Album1" duration "200" genres "Pop,Rock"`
- `node main.js createPlaylist name "My Playlist" maxDuration 100 genres "Pop"`
- `node main.js removeTrack albumName "Album1" trackTitle "Track1"`
- `node main.js removeAlbum artistName "Artista1" albumName "Album1"`
- `node main.js removeArtist name "Artista1"`
- `node main.js removePlaylist name "My Playlist"`
- `node main.js searchByName name "a"`
- `node main.js tracksByArtist artistName "Artista1"`

## Script que popula y realiza operaciones varias.
- `./runUnqfy.sh` (Probablemente haya que darle permisos con `chmod +rx runUnqfy.sh`)

## Visados
- [Visado 1](https://docs.google.com/document/d/1Tfkl6l1_ly4FybquDjTqMHa5gdmrYgvvZpXZaneRFvA/edit?usp=sharing)

## UML
![UML](https://user-images.githubusercontent.com/32984697/93656451-faa0af00-fa00-11ea-801f-a3c8251ef998.PNG)

---
###### Goffredo, Gastón - Correa, David
###### UNQ 2020 S2 - Servicios Cloud - UNQfy
