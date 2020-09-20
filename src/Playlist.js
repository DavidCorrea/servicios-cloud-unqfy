class Playlist {
  constructor(id, name, tracks){
    this.id = id;
    this.name = name;
    this.tracks = tracks;
  }

  duration() {
    return this.tracks.reduce((totalDuration, track) => totalDuration + track.duration, 0);
  }

  hasTrack(track) {
    return this.tracks.includes(track);
  }

  removeTracks(tracksToRemove) {
    const tracksToRemoveIds = tracksToRemove.map(trackToRemove => trackToRemove.id);
    this.tracks = this.tracks.filter((track) => !tracksToRemoveIds.includes(track.id));
  }
}

module.exports = Playlist;
