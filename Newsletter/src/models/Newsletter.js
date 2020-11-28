const Subscription = require('./Subscription');
//const Spotify = require('../clients/UNQfyClient');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  subscribe(artistId, email) {
    let subscription = this.getSubscriptions(artistId);
    subscription.addSubscriptor(email);
  }

  unsubscribe(artistId, email) {
    let subscription = this.getSubscriptions(artistId);
    subscription.removeSubscription(email);
  }


  notify(artistId) {
    throw new Error("Not implemented");
  }

  getSubscriptions(artistId){
    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId);
    if(!subscription.length){
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
