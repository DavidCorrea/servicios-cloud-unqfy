/* eslint-env node, mocha */

const assert = require('chai').assert;
const UNQfy = require('../src/unqfy');

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
  
    it('should raise an error if a track has an empty duration', () => {
      const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
      const album = createAndAddAlbum(unqfy, artist.id, 'Appetite for Destruction', 1987);
      assert.throws(() => createAndAddTrack(unqfy, album.id, 'Welcome to the jungle', '', ['rock', 'hard rock']), "Couldn't create new Track: Duration cannot be empty");
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
});

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
