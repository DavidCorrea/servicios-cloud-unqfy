const Reproduction = require("./Reproduction");

class User {
  constructor(id, name){
    this.id = id;
    this.name = name;
    this.reproductions = [];
  }

  addReproduction(reproduction) {
    this.reproductions.push(reproduction);
  }

  listenedTracks() {
    return [...new Set(this.reproductions)];
  }

  timesTrackWasListened(track) {
    return this.reproductions.reduce((trackReproductionCount, reproduction) => { 
      return reproduction.track === track ? trackReproductionCount + 1 : trackReproductionCount;
    }, 0);
  }

  hasListenedTo(track) {
    return this.reproductions.some(reproduction => reproduction.track === track);
  }
}  

module.exports = User;
