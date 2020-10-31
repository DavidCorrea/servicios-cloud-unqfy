/* eslint-env node, mocha */

const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised'));

const UNQfy = require('../../src/models/Unqfy');
const SpotifyMocks = require('../mocks/spotify');
const MusixMatchMocks = require('../mocks/musixmatch');

function createAndAddArtist(unqfy, artistName, country) {
  const artist = unqfy.addArtist({ name: artistName, country });
  return artist;
}

function createAndAddAlbum(unqfy, artistId, albumName, albumYear) {
  return unqfy.addAlbum(artistId, { name: albumName, year: albumYear });
}

function createAndAddTrack(unqfy, albumId, trackName, trackDuraction, trackGenres) {
  return unqfy.addTrack(albumId, { name: trackName, duration: trackDuraction, genres: trackGenres });
}

function usersListenToTrack(unqfy, users, track) {
  users.forEach(user => unqfy.userListenTo(user.name, track.title));
}

describe('Add, remove and filter data', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new UNQfy();
  });

  describe('#addArtist', () => {
    it('should add an artist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
  
      assert.equal(artist.name, 'Guns n\' Roses');
      assert.equal(artist.country, 'USA');
    });
  
    it('should raise an error if an artist with the same name already exists', () => {
      createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
  
      assert.throws(() => createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA'), "Couldn't create new Artist: Name was already taken");
    });
  
    it('should raise an error if an artist has an empty name', () => {
      assert.throws(() => createAndAddArtist(unqfy, '', 'USA'), "Couldn't create new Artist: Name cannot be empty");
    });
  
    it('should raise an error if an artist has an empty country', () => {
      assert.throws(() => createAndAddArtist(unqfy, 'Guns n\' Roses', ''), "Couldn't create new Artist: Country cannot be empty");
    });
  });

  describe('#removeArtist', () => {
    it('should remove the artist from UNQfy and all of its tracks from the playlists that includes them', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album1 = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track1 = createAndAddTrack(unqfy, album1.id, 'Roses track 1', 200, ['pop', 'movie']);
      const track2 = createAndAddTrack(unqfy, album1.id, 'Roses track 2', 200, ['pop', 'movie']);
      const album2 = createAndAddAlbum(unqfy, artist.id, 'Appetite for Peace', 1987);
      const track3 = createAndAddTrack(unqfy, album2.id, 'Roses track 3', 200, ['pop', 'movie']);
      const track4 = createAndAddTrack(unqfy, album2.id, 'Roses track 4', 200, ['pop', 'movie']);
      const playlist = unqfy.createPlaylist('Roses playlist', ['pop'], 1400);
      
      assert.isTrue(playlist.hasTrack(track1));
      assert.isTrue(playlist.hasTrack(track2));
      assert.isTrue(playlist.hasTrack(track3));
      assert.isTrue(playlist.hasTrack(track4));

      unqfy.removeArtist(artist.id);

      assert.throws(() => unqfy.getArtistById(artist.id), "Artist does not exist");
      assert.isFalse(playlist.hasTrack(track1));
      assert.isFalse(playlist.hasTrack(track2));
      assert.isFalse(playlist.hasTrack(track3));
      assert.isFalse(playlist.hasTrack(track4));
    });

    it('should raise an error when trying to remove an album and the artist does not exist', () => {
      assert.throws(() => unqfy.removeArtist('Not existant'), "Artist does not exist");
    });
  });

  describe('#addAlbum', () => {
    it('should add an album to an artist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
  
      assert.equal(album.name, 'Appetite for Destruction');
      assert.equal(album.year, 1987);
    });
  
    it('should raise an error when adding an album if artist does not exists', () => {
      assert.throws(() => createAndAddAlbum(unqfy, undefined, 'Album1', 1987), "Artist does not exist");
    });
  
    it('should raise an error if an album with the same name already exists', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
  
      assert.throws(() => createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987), "Couldn't create new Album: Name was already taken");
    });
  
    it('should raise an error if an album has an empty name', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      assert.throws(() => createAndAddAlbum(unqfy, artist.id, '', 1987), "Couldn't create new Album: Name cannot be empty");
    });
  });

  describe('#removeAlbum', () => {
    it('should remove an album from its Artist and the album\'s songs from the playlists that includes them', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track1 = createAndAddTrack(unqfy, album.id, 'Roses track 1', 200, ['pop', 'movie']);
      const track2 = createAndAddTrack(unqfy, album.id, 'Roses track 2', 200, ['pop', 'movie']);
      const track3 = createAndAddTrack(unqfy, album.id, 'Roses track 3', 200, ['pop', 'movie']);
      const playlist = unqfy.createPlaylist('Roses playlist', ['pop'], 1400);
      
      assert.isTrue(artist.hasAlbum(album));
      assert.isTrue(playlist.hasTrack(track1));
      assert.isTrue(playlist.hasTrack(track2));
      assert.isTrue(playlist.hasTrack(track3));

      unqfy.removeAlbum(artist.id, album.id);

      assert.isFalse(artist.hasAlbum(album));
      assert.isFalse(playlist.hasTrack(track1));
      assert.isFalse(playlist.hasTrack(track2));
      assert.isFalse(playlist.hasTrack(track3));
    });

    it('should raise an error when trying to remove an album and it does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

      assert.throws(() => unqfy.removeAlbum(artist.id, 'Not existant'), "Album does not exist");
    });

    it('should raise an error when trying to remove an album and the artist does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);

      assert.throws(() => unqfy.removeAlbum('Not existant', album.id), "Artist does not exist");
    });
  });

  describe('#addTrack', () => {
    it('should add a track to an album', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
  
      assert.equal(track.title, 'Welcome to the jungle');
      assert.strictEqual(track.duration, 200);
      assert.equal(track.genres.includes('rock'), true);
      assert.equal(track.genres.includes('hard rock'), true);
      assert.lengthOf(track.genres, 2);
    });
  
    it('should raise an error when adding a track if album does not exists', () => {
      assert.throws(() => createAndAddTrack(unqfy, undefined, 'Welcome to the jungle', 200, ['rock', 'hard rock']));
    });
  
    it('should raise an error if a track with the same title already exists', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
  
      assert.throws(() => createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']), "Couldn't create new Track: Title was already taken");
    });
  
    it('should raise an error if a track has an empty title', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      assert.throws(() => createAndAddTrack(unqfy, album.id, '', 200, ['rock', 'hard rock']), "Couldn't create new Track: Title cannot be empty");
    });
  
    it('should raise an error if a track has a duration lower than 1', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      assert.throws(() => createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 0, ['rock', 'hard rock']), "Couldn't create new Track: Duration must be bigger than zero");
    });
  
    it('should raise an error if a track has an empty genres', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      assert.throws(() => createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, []), "Couldn't create new Track: genres cannot be empty");
    });
  })

  describe('#removeTrack', () => {
    it('should remove a track from its album and the playlist that includes it', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track = createAndAddTrack(unqfy, album.id, 'Roses track', 200, ['pop', 'movie']);
      const playlist = unqfy.createPlaylist('Roses playlist', ['pop'], 1400);
      
      assert.isTrue(album.hasTrack(track));
      assert.isTrue(playlist.hasTrack(track));

      unqfy.removeTrack(album.id, track.id);

      assert.isFalse(album.hasTrack(track));
      assert.isFalse(playlist.hasTrack(track));
    });

    it('should raise an error when trying to remove a track and it does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);

      assert.throws(() => unqfy.removeTrack(album.id, 'Not existant'), "Track does not exist");
    });

    it('should raise an error when trying to remove a track and the album does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const track = createAndAddTrack(unqfy, album.id, 'Roses track', 200, ['pop', 'movie']);

      assert.throws(() => unqfy.removeTrack('Not existant', track.id), "Album does not exist");
    });
  });

  describe('#createUser', () => {
    it('should create an user', () => {
      const user = unqfy.createUser('John');
  
      assert.equal(user.name, 'John');
    });

    it('should raise an error if an user with the same name already exists', () => {
      unqfy.createUser('John');
  
      assert.throws(() => unqfy.createUser('John'), "Couldn't create new User: Name was already taken");
    });

    it('should raise an error if an user has an empty name', () => {
      assert.throws(() => unqfy.createUser(''), "Couldn't create new User: Name cannot be empty");
    });
  });

  describe('#userListenTo', () => {
    it('should keep track of the user listenings', () => {
      const artist = createAndAddArtist(unqfy, 'Deadmau5', 'Canada');
      const album = createAndAddAlbum(unqfy, artist.id, "where's the drop?", 2018);
      const track = createAndAddTrack(unqfy, album.id, 'Strobe', 311, ['Electronica', 'House']);
      const user = unqfy.createUser('John');
  
      assert.isFalse(user.hasListenedTo(track));
      unqfy.userListenTo(user.name, track.title);
      assert.isTrue(user.hasListenedTo(track));
    });

    it('should raise an error if an user with the name does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Deadmau5', 'Canada');
      const album = createAndAddAlbum(unqfy, artist.id, "where's the drop?", 2018);
      const track = createAndAddTrack(unqfy, album.id, 'Strobe', 311, ['Electronica', 'House']);
  
      assert.throws(() => unqfy.userListenTo('Not existent', track.title), 'User does not exist');
    });

    it('should raise an error if a track with the name does not exist', () => {
      const user = unqfy.createUser('John');

      assert.throws(() => unqfy.userListenTo(user.name, 'Not existent'), 'Track does not exist');
    });
  });

  describe('#tracksUserListenedTo', () => {
    it('should return tracks that a user has listened to', () => {
      const artist = createAndAddArtist(unqfy, 'Deadmau5', 'Canada');
      const album = createAndAddAlbum(unqfy, artist.id, "where's the drop?", 2018);
      const track1 = createAndAddTrack(unqfy, album.id, 'Strobe', 311, ['Electronica', 'House']);
      const track2 = createAndAddTrack(unqfy, album.id, 'Imaginary Friends', 311, ['Electronica', 'House']);
      const track3 = createAndAddTrack(unqfy, album.id, 'Coelacanth', 311, ['Electronica', 'House']);

      const user1 = unqfy.createUser('John');
      const user2 = unqfy.createUser('Sarah');

      usersListenToTrack(unqfy, [user1, user2], track1);
      usersListenToTrack(unqfy, [user1], track2);
      usersListenToTrack(unqfy, [user2], track3);
  
      assert.sameMembers(unqfy.tracksUserListenedTo(user1.name), [track1, track2]);
      assert.sameMembers(unqfy.tracksUserListenedTo(user2.name), [track1, track3]);
    });

    it('should raise an error if an user with the name does not exist', () => {
      assert.throws(() => unqfy.tracksUserListenedTo('Not existent'), 'User does not exist');
    });
  });

  describe('#timesUserListenedTo', () => {
    it('should return the times a user listened to a specific track', () => {
      const artist = createAndAddArtist(unqfy, 'Deadmau5', 'Canada');
      const album = createAndAddAlbum(unqfy, artist.id, "where's the drop?", 2018);
      const track = createAndAddTrack(unqfy, album.id, 'Strobe', 311, ['Electronica', 'House']);
      const user = unqfy.createUser('John');
  
      assert.equal(unqfy.timesUserListenedTo(user.name, track.title), 0);
      unqfy.userListenTo(user.name, track.title);
      assert.equal(unqfy.timesUserListenedTo(user.name, track.title), 1);
    });

    it('should raise an error if an user with the name does not exist', () => {
      const artist = createAndAddArtist(unqfy, 'Deadmau5', 'Canada');
      const album = createAndAddAlbum(unqfy, artist.id, "where's the drop?", 2018);
      const track = createAndAddTrack(unqfy, album.id, 'Strobe', 311, ['Electronica', 'House']);
  
      assert.throws(() => unqfy.timesUserListenedTo('Not existent', track.title), 'User does not exist');
    });

    it('should raise an error if a track with the name does not exist', () => {
      const user = unqfy.createUser('John');

      assert.throws(() => unqfy.timesUserListenedTo(user.name, 'Not existent'), 'Track does not exist');
    });
  });

  describe('#createThisIsList', () => {
    it('should return the top three listened songs of an artist', () => {
      const user1 = unqfy.createUser('John');
      const user2 = unqfy.createUser('Sarah');
      const user3 = unqfy.createUser('James');
      const user4 = unqfy.createUser('Elizabeth');

      const artist = createAndAddArtist(unqfy, 'Haywyre', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, "Two Fold Pt. 1", 2014);
      const firstMostListenedTrack = createAndAddTrack(unqfy, album.id, "The Schism", 200, ['Future Bass']);
      const secondMostListenedTrack = createAndAddTrack(unqfy, album.id, "Dichotomy", 200, ['Future Bass']);
      const thirdMostListenedTrack = createAndAddTrack(unqfy, album.id, "Doppelgänger", 200, ['Future Bass']);
      const forthMostListenedTrack = createAndAddTrack(unqfy, album.id, "Voice of Reason", 200, ['Future Bass']);

      const otherArtist = createAndAddArtist(unqfy, 'Snarky Puppy', 'USA');
      const otherAlbum = createAndAddAlbum(unqfy, otherArtist.id, 'We Like It Here', 2014);
      const otherMostListenedTrack = createAndAddTrack(unqfy, otherAlbum.id, "Sleeper", 200, ['Jazz Fusion']);

      usersListenToTrack(unqfy, [user1], forthMostListenedTrack);
      usersListenToTrack(unqfy, [user1, user2], thirdMostListenedTrack);
      usersListenToTrack(unqfy, [user1, user2, user3], secondMostListenedTrack);
      usersListenToTrack(unqfy, [user1, user2, user3, user4], firstMostListenedTrack);
      usersListenToTrack(unqfy, [user1, user2, user3, user4], otherMostListenedTrack);

      const artistMostListenedTracks = unqfy.createThisIsList(artist.name);
      assert.lengthOf(artistMostListenedTracks, 3);
      assert.sameOrderedMembers(artistMostListenedTracks, [firstMostListenedTrack, secondMostListenedTrack, thirdMostListenedTrack]);
      assert.notInclude(artistMostListenedTracks, forthMostListenedTrack);
      assert.notInclude(artistMostListenedTracks, otherMostListenedTrack);

      const otherArtistMostListenedTracks = unqfy.createThisIsList(otherArtist.name);
      assert.lengthOf(otherArtistMostListenedTracks, 1);
      assert.sameOrderedMembers(otherArtistMostListenedTracks, [otherMostListenedTrack]);
    });

    it('should raise an error when the artist does not exist', () => {
      assert.throws(() => unqfy.createThisIsList('Not existing artist'), 'Artist does not exist');
    });
  });
  
  describe('#populateAlbumsForArtist', () => {
    const artistName = 'Deadmau5';
    const albumName = 'W:/2016ALBUM/';
    const spotifyArtistId = 1;
    let artist = null;

    beforeEach(() => {
      artist = createAndAddArtist(unqfy, artistName, 'Canada');
    });

    it("should populate an artist's albums with Spotify's response", async () => {     
      SpotifyMocks.mockSuccessfulArtistSearchRequest(artistName, spotifyArtistId);
      SpotifyMocks.mockSuccessfulArtistAlbumsRequest(spotifyArtistId, [
        { name: albumName, release_date: '2005-01-01' } 
      ]);

      await unqfy.populateAlbumsForArtist(artistName);

      const populatedAlbum = unqfy.getAlbumByName(albumName);
      assert.isTrue(artist.hasAlbum(populatedAlbum));
      assert.equal(populatedAlbum.name, albumName);
      assert.equal(populatedAlbum.year, '2005');
    });

    context('When the artist search could not be performed', () => {
      it('should raise an error', async () => {
        SpotifyMocks.mockUnsuccessfulArtistSearchRequest(artistName, 401, 'Token expired');

        await assert.isRejected(unqfy.populateAlbumsForArtist(artistName), "Couldn't fetch Artist: Token expired");
      })
    });

    context('When the artist albums search could not be performed', () => {
      it('should raise an error', async () => {
        SpotifyMocks.mockSuccessfulArtistSearchRequest(artistName, spotifyArtistId);
        SpotifyMocks.mockUnsuccessfulArtistAlbumsRequest(spotifyArtistId, 401, 'Token expired');

        await assert.isRejected(unqfy.populateAlbumsForArtist(artistName), "Couldn't fetch Artist's albums: Token expired");
      })
    });
  });

  describe('#trackLyrics', () => {
    const musixMatchTrackId = 1;
    const musixMatchTrackLyrics = "You're free to touch the sky";
    let track = null;

    beforeEach(() => {
      const artist = createAndAddArtist(unqfy, 'Muse', 'UK');
      const album = createAndAddAlbum(unqfy, artist.id, 'Drones', 2015);
      track = createAndAddTrack(unqfy, album.id, 'Dead Inside', 200, 'Rock');
    });

    it("should get the track lyrics", async () => {
      MusixMatchMocks.mockSuccessfulTrackSearchRequest(track.title, musixMatchTrackId);
      MusixMatchMocks.mockSuccessfulTrackLyricsRequest(musixMatchTrackId, musixMatchTrackLyrics);

      const trackLyrics = await unqfy.trackLyrics(track.title);
      assert.equal(trackLyrics, musixMatchTrackLyrics);
    });

    context('When the track search could not be performed', () => {
      it('should raise an error', async () => {
        MusixMatchMocks.mockUnsuccessfulTrackSearchRequest(track.title, 401);

        await assert.isRejected(unqfy.trackLyrics(track.title), "Couldn't fetch Track: Status 401");
      })
    });

    context('When the track lyrics search could not be performed', () => {
      it('should raise an error', async () => {
        MusixMatchMocks.mockSuccessfulTrackSearchRequest(track.title, musixMatchTrackId);
        MusixMatchMocks.mockUnsuccessfulTrackLyricsRequest(musixMatchTrackId, 401);

        await assert.isRejected(unqfy.trackLyrics(track.title), "Couldn't fetch Track's lyrics: Status 401");
      })
    });
  });

  // Busquedas

  describe('#filters', () => {
    it('should find different things by name', () => {
      const artist1 = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album1 = createAndAddAlbum(unqfy, artist1.id, 'Roses Album', 1987);
      const track = createAndAddTrack(unqfy, album1.id, 'Roses track', 200, ['pop', 'movie']);
      const playlist = unqfy.createPlaylist('Roses playlist', ['pop'], 1400);
    
      const results = unqfy.searchByName('Roses');
      assert.deepEqual(results, {
        artists: [artist1],
        albums: [album1],
        tracks: [track],
        playlists: [playlist],
      });
    });
    
    it('should get all tracks matching genres', () => {
      const artist1 = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album1 = createAndAddAlbum(unqfy, artist1.id, 'Appetite for Destruction', 1987);
      const t0 = createAndAddTrack(unqfy, album1.id, 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
      const t1 = createAndAddTrack(unqfy, album1.id, 'Sweet Child o\' Mine', 500, ['rock', 'hard rock', 'pop', 'movie']);
    
      const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
      const album2 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
      const t2 = createAndAddTrack(unqfy, album2.id, 'Trhiller', 200, ['pop', 'movie']);
      createAndAddTrack(unqfy, album2.id, 'Another song', 500, ['classic']);
      const t3 = createAndAddTrack(unqfy, album2.id, 'Another song II', 500, ['movie']);
    
      const tracksMatching = unqfy.getTracksMatchingGenres(['pop', 'movie']);
    
      // assert.equal(tracks.matching.constructor.name, Array);
      assert.isArray(tracksMatching);
      assert.lengthOf(tracksMatching, 4);
      assert.equal(tracksMatching.includes(t0), true);
      assert.equal(tracksMatching.includes(t1), true);
      assert.equal(tracksMatching.includes(t2), true);
      assert.equal(tracksMatching.includes(t3), true);
    });
    
    it('should get all tracks matching artist', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const t1 = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
      const t2 = createAndAddTrack(unqfy, album.id, 'It\'s so easy', 200, ['rock', 'hard rock']);
    
      const album2 = createAndAddAlbum(unqfy, artist.id, 'Use Your Illusion I', 1992);
      const t3 = createAndAddTrack(unqfy, album2.id, 'Don\'t Cry', 500, ['rock', 'hard rock']);
    
      const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
      const album3 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
      createAndAddTrack(unqfy, album3.id, 'Thriller', 200, ['pop', 'movie']);
      createAndAddTrack(unqfy, album3.id, 'Another song', 500, ['classic']);
      createAndAddTrack(unqfy, album3.id, 'Another song II', 500, ['movie']);
    
      const matchingTracks = unqfy.getTracksMatchingArtist(artist.name);
    
      assert.isArray(matchingTracks);
      assert.lengthOf(matchingTracks, 3);
      assert.isTrue(matchingTracks.includes(t1));
      assert.isTrue(matchingTracks.includes(t2));
      assert.isTrue(matchingTracks.includes(t3));
    });

    it('should get all albums matching artist', () => {
      const matchingArtist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album1FromMatchingArtist = createAndAddAlbum(unqfy, matchingArtist.id, 'Appetite for Destruction', 1987);
      createAndAddTrack(unqfy, album1FromMatchingArtist.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
      createAndAddTrack(unqfy, album1FromMatchingArtist.id, 'It\'s so easy', 200, ['rock', 'hard rock']);
    
      const album2FromMatchingArtist = createAndAddAlbum(unqfy, matchingArtist.id, 'Use Your Illusion I', 1992);
      createAndAddTrack(unqfy, album2FromMatchingArtist.id, 'Don\'t Cry', 500, ['rock', 'hard rock']);
    
      const otherArtist = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
      const otherArtistAlbum = createAndAddAlbum(unqfy, otherArtist.id, 'Thriller', 1987);
      createAndAddTrack(unqfy, otherArtistAlbum.id, 'Thriller', 200, ['pop', 'movie']);
    
      const matchingAlbumsForQueriedArtist = unqfy.getAlbumsMatchingArtist(matchingArtist.name);
    
      assert.isArray(matchingAlbumsForQueriedArtist);
      assert.lengthOf(matchingAlbumsForQueriedArtist, 2);
      assert.isTrue(matchingAlbumsForQueriedArtist.includes(album1FromMatchingArtist));
      assert.isTrue(matchingAlbumsForQueriedArtist.includes(album2FromMatchingArtist));
      assert.isFalse(matchingAlbumsForQueriedArtist.includes(otherArtistAlbum));
    });

    it('should get all tracks matching album', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const matchingAlbum = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      const matchingAlbumTrack = createAndAddTrack(unqfy, matchingAlbum.id, 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    
      const otherAlbum = createAndAddAlbum(unqfy, artist.id, 'Use Your Illusion I', 1992);
      const otherAlbumTrack = createAndAddTrack(unqfy, otherAlbum.id, 'Don\'t Cry', 500, ['rock', 'hard rock']);
    
      const matchingAlbumTracks = unqfy.getTracksMatchingAlbum(matchingAlbum.name);
    
      assert.isArray(matchingAlbumTracks);
      assert.lengthOf(matchingAlbumTracks, 1);
      assert.isTrue(matchingAlbumTracks.includes(matchingAlbumTrack));
      assert.isFalse(matchingAlbumTracks.includes(otherAlbumTrack));
    });
  });
});

// Playlist

describe('Playlist Creation and properties', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new UNQfy();
  });

  it('should create a playlist as requested', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', 200, ['rock', 'hard rock', 'movie']);
    createAndAddTrack(unqfy, album.id, 'Sweet Child o\' Mine', 1500, ['rock', 'hard rock', 'pop', 'movie']);

    const artist2 = createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    const album2 = createAndAddAlbum(unqfy, artist2.id, 'Thriller', 1987);
    const t2 = createAndAddTrack(unqfy, album2.id, 'Thriller', 200, ['pop', 'movie']);
    const t3 = createAndAddTrack(unqfy, album2.id, 'Another song', 500, ['pop']);
    const t4 = createAndAddTrack(unqfy, album2.id, 'Another song II', 500, ['pop']);

    const playlist = unqfy.createPlaylist('my playlist', ['pop', 'rock'], 1400);

    assert.equal(playlist.name, 'my playlist');
    assert.isAtMost(playlist.duration(), 1400);
    assert.isTrue(playlist.hasTrack(t1));
    assert.isTrue(playlist.hasTrack(t2));
    assert.isTrue(playlist.hasTrack(t3));
    assert.isTrue(playlist.hasTrack(t4));
    assert.lengthOf(playlist.tracks, 4);
  });

  it('should raise an error when the name is empty', () => {
    assert.throws(() => unqfy.createPlaylist('', ['pop'], 1400), "Couldn't create new Playlist: Name cannot be empty");
  });

  it('should raise an error when the genres are empty', () => {
    assert.throws(() => unqfy.createPlaylist('My Playlist', [], 1400), "Couldn't create new Playlist: Genres cannot be empty");
  });

  it('should raise an error when the max duration is lower than 1', () => {
    assert.throws(() => unqfy.createPlaylist('My Playlist', ['pop'], 0), "Couldn't create new Playlist: Max duration must be bigger than zero");
  });
});
