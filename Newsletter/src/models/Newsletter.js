const Subscription = require('./Subscription');
//const Spotify = require('../clients/UNQfyClient');

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  subscribe(artistId, email) {
    let subscription = this.getSubscription(artistId);
    subscription.addSubscriptor(email);
  }

  unsubscrive(artistId, email) {
    throw new Error("Not implemented");
  }


  notify(artistId) {
    throw new Error("Not implemented");
  }

  getSubscription(artistId){
    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId);
    if(!subscription.length){
	    subscription = new Subscription(artistId);
      this.subscriptions.push(subscription);
    }
    return subscription;
	}
	
  getSubscriptions(artistId) {
    throw new Error("Not implemented");
  }

  deleteSubscriptions(artistId) {
    throw new Error("Not implemented");
  }

}

module.exports = Newsletter;
