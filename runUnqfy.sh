#!/usr/bin/env bash
function execute() { eval "node main.js $1"; }

function add_artist() { execute "addArtist name $1 country $2"; }
function add_album() { execute "addAlbum name $1 artist $2 year $3"; }
function add_track() { execute "addTrack title $1 album $2 duration $3 genres $4"; }
function create_playlist() { execute "createPlaylist name $1 maxDuration $2 genres $3"; }

# Artist 1
add_artist 'Muse' "\"Reino Unido\""

add_album "\"Simulation Theory\"" "Muse" 2018
add_track "\"Dig Down\"" "\"Simulation Theory\"" 228 'Alternativo,Progresivo,Electronica'
add_track "\"Thought Contagion\"" "\"Simulation Theory\"" 206 'Alternativo,Progresivo,Electronica'

add_album 'Drones' 'Muse' 2015
add_track "\"Dead Inside\"" 'Drones' 262 'Alternativo,Progresivo,Electronica'
add_track 'Psycho' 'Drones' 316 'Alternativo,Progresivo,Electronica'

# Artist 2
add_artist "\"Taylor Swift\"" "\"Estados Unidos\""

add_album 'Lover' "\"Taylor Swift\"" 2019
add_track "\"I Forgot That You Existed\"" 'Lover' 170 'Pop,Country'
add_track "\"Cruel Summer\"" 'Lover' 178 'Pop,Country'

add_album 'Reputation' "\"Taylor Swift\"" 2017
add_track "\"...Ready For It?\"" 'Reputation' 208 'Pop,Country'
add_track "\"End Game\"" 'Reputation' 244 'Pop,Country'

# Artist 3
add_artist 'Deadmau5' 'Canada'

add_album "\"where's the drop?\"" 'Deadmau5' 2018
add_track 'Strobe' "\"where's the drop?\"" 311 'Electronica,House,Trance'
add_track "\"Imaginary Friends\"" "\"where's the drop?\"" 103 'Electronica,House,Trance'

add_album "\"here's the drop!\"" 'Deadmau5' 2019
add_track "\"Strobe (PEEKABOO Remix)\"" "\"here's the drop!\"" 244 'Electronica,House,Trance'
add_track "\"Imaginary Friends (Morgan Page Remix)\"" "\"here's the drop!\"" 492 'Electronica,House,Trance'

# Playlists
create_playlist "\"Mix 1\"" 1000 'Electronica,Progresivo,Country'
create_playlist "\"Mix 2\"" 1500 'Electronica,Progresivo,Pop,Alternativo'
create_playlist "\"Mix 3\"" 2000 'Trance,Country'