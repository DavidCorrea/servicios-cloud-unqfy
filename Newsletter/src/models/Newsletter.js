require('dotenv').config();
require('dotenv').config();
const ArtistSubscription = require('./ArtistSubscription');
const UNQfy = require('../clients/UNQfyClient');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  async subscribe(artistId, email) {
    await UNQfy.validateArtistExistanceById(artistId)
    let subscription = this.getArtistSubscriptions(artistId);
    subscription.addSubscriptor(email);
  }

  unsubscribe(artistId, email) {
    let subscription = this.getArtistSubscriptions(artistId);
    subscription.removeSubscriptor(email);
  }

  notify(artistId) {
    throw new Error("Not implemented");
  }

  getArtistSubscriptions(artistId){
    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId)[0];
    if(!subscription){
	    subscription = new ArtistSubscription(artistId);
      this.subscriptions.push(subscription);
    }
    return subscription;
	}

  deleteSubscriptionsForArtist(artistId) {
    this.subscriptions = this.subscriptions.filter(subscription => subscription.artistId !== artistId);
  }
}

module.exports = Newsletter;
