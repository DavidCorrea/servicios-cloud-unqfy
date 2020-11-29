require('dotenv').config();
const Subscription = require('./Subscription');
const UNQfy = require('../clients/UNQfyClient');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  async subscribe(artistId, email) {
      await UNQfy.validateArtistExistanceById(artistId)
      let subscription = this.getSubscriptions(artistId);
      subscription.addSubscriptor(email);
  }

  unsubscribe(artistId, email) {
    let subscription = this.getSubscriptions(artistId);
    subscription.removeSubscriptor(email);
  }

  notify(artistId) {
    throw new Error("Not implemented");
  }

  getSubscriptions(artistId){
    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId)[0];
    if(!subscription){
	    subscription = new Subscription(artistId);
      this.subscriptions.push(subscription);
    }
    return subscription;
	}

  deleteSubscriptions(artistId) {
    this.subscriptions = this.subscriptions.filter(subscription => subscription.artistId !== artistId);
  }

}

module.exports = Newsletter;
