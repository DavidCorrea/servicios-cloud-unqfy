#!/usr/bin/env bash
function execute() { eval "node main.js $1"; }

function add_artist() { execute "addArtist name $1 country $2"; }
function add_album() { execute "addAlbum name $1 artist $2 year $3"; }
function add_track() { execute "addTrack title $1 album $2 duration $3 genres $4"; }
function create_playlist() { execute "createPlaylist name $1 maxDuration $2 genres $3"; }
function add_user() { execute "addUser name $1"; }

function remove_artist() { execute "removeArtist name $1"; }
function remove_album() { execute "removeAlbum artistName $1 albumName $2"; }
function remove_track() { execute "removeTrack albumName $1 trackTitle $2"; }
function remove_playlist() { execute "removePlaylist name $1"; }

function all_artists() { execute "allArtists"; }
function all_albums() { execute "allAlbums"; }
function all_tracks() { execute "allTracks"; }
function all_playlists() { execute "allPlaylists"; }

function search_by_name() { execute "searchByName name $1"; }
function tracks_by_artist() { execute "tracksByArtist artistName $1"; }
function tracks_by_genres() { execute "tracksByGenres genres $1"; }
function albums_by_artist() { execute "albumsByArtist artistName $1"; }
function album_tracks() { execute "albumTracks albumName $1"; }
function user_listen_to() { execute "userListenTo userName $1 trackTitle $2"; }
function times_user_listened_to() { execute "timesUserListenedTo userName $1 trackTitle $2"; }
function create_this_is_list() { execute "createThisIsList artistName $1"; }

echo 'Running script...'
echo 'Creating artists, albums, tracks, users, and playlists...'

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

# Users
add_user 'John'
add_user 'Sarah'

echo 'Creation finished.'

echo 'Searching all created artists...'
all_artists

echo 'Searching all created albums...'
all_albums

echo 'Searching all created tracks...'
all_tracks

echo 'Searching all created playlists...'
all_playlists

echo 'Searching for all records that contains "a"...'
search_by_name 'a'

echo 'Searching for all Muse tracks...'
tracks_by_artist 'Muse'

echo 'Searching for all Electronica genre tracks...'
tracks_by_genres 'Electronica'

echo 'Searching for all Taylor Swift albums...'
albums_by_artist "\"Taylor Swift\""

echo 'Searching for all the tracks of the Reputation album'
album_tracks 'Reputation'

echo 'Removing Muse from UNQfy...'
remove_artist 'Muse'

echo "Removing Taylor Swift's album, Lover..."
remove_album "\"Taylor Swift\"" 'Lover'

echo "Removing 'End Game' track from Taylor Swift's album, Reputation..."
remove_track "Reputation" "\"End Game\""

echo "Removing Mix 3..."
remove_playlist "\"Mix 3\""

echo 'Searching for all objects again...'
echo 'Artists...'
all_artists

echo 'Albums...'
all_albums

echo 'Tracks...'
all_tracks

echo 'Playlists...'
all_playlists

echo 'Making users listen to some tracks...'
user_listen_to 'John' "\"Imaginary Friends\""
user_listen_to 'Sarah' "\"Strobe (PEEKABOO Remix)\""
user_listen_to 'John' "\"...Ready For It?\""
user_listen_to 'Sarah' "\"Imaginary Friends\""

echo 'Checking how many times they listened to "Ready for it?"'
times_user_listened_to 'John' "\"...Ready For It?\""
times_user_listened_to 'Sarah' "\"...Ready For It?\""

echo 'Checking Deadmau5 most listened tracks'
create_this_is_list 'Deadmau5'

echo 'Script finished.'