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
- `addAlbum name "NAME" artist "ARTIST_NAME" year YEAR`
- `addTrack title "TITLE" album "ALBUM_NAME" duration DURATION_IN_SECONDS genres "GENRE_1,GENRE_2"`
- `createPlaylist name "NAME genres "GENRE_1,GENRE_2" maxDuration MAX_DURATION_IN_SECONDS`
- `removeTrack albumName "ALBUM_NAME" trackTitle "TRACK_TITLE"`

## Set de pruebas desde consola 
- `node main.js addArtist name "Artista1" country "Countr1"`
- `node main.js addAlbum name "Album1" artist "Artista1" year "2020"`
- `node main.js addTrack title "Track" album "Album1" duration "200" genres "Pop,Rock"`
- `node main.js createPlaylist name "My Playlist" maxDuration 100 genres "Pop"`

## Script que popula y realiza operaciones varias.
- `./runUnqfy.sh` (Probablemente haya que darle permisos con `chmod +rx runUnqfy.sh`)

## Visados
- [Visado 1](https://docs.google.com/document/d/1Tfkl6l1_ly4FybquDjTqMHa5gdmrYgvvZpXZaneRFvA/edit?usp=sharing)

## UML
![UML](https://user-images.githubusercontent.com/32984697/93656451-faa0af00-fa00-11ea-801f-a3c8251ef998.PNG)

---
###### Goffredo, Gastón - Correa, David
###### UNQ 2020 S2 - Servicios Cloud - UNQfy
