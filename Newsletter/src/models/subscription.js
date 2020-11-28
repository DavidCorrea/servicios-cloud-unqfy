const { exception } = require("console");

class Subscription {
  constructor(artistId){
    this.artisId = artistId;
    this.subscriptors = [];
	}

  addSubscriptor(email){
    this.subscriptors.push(email);
  }
}  

module.exports = Subscription;
