const Artist = require('./Subscription');
//const Spotify = require('../clients/UNQfyClient');
const { exception } = require('console');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }



  subscribe(artistID, email) {
    throw new exception("Not implemented");
  }

  unsubscrive(artistID, email) {
    throw new exception("Not implemented");
  }


  notify(artistID) {
    throw new exception("Not implemented");
  }

  getSubscriptions(artistID) {
    throw new exception("Not implemented");
  }

  deleteSubscriptions(artistID) {
    throw new exception("Not implemented");
  }

}

module.exports = Newsletter;
