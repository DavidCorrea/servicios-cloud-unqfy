const Artist = require('./Subscription');
//const Spotify = require('../clients/UNQfyClient');
const { exception } = require('console');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  subscribe(artistID, email) {
    throw new Error("Not implemented");
  }

  unsubscrive(artistID, email) {
    throw new Error("Not implemented");
  }


  notify(artistID) {
    throw new Error("Not implemented");
  }

  getSubscriptions(artistID) {
    throw new Error("Not implemented");
  }

  deleteSubscriptions(artistID) {
    throw new Error("Not implemented");
  }

}

module.exports = Newsletter;
