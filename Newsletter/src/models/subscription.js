const { exception } = require("console");

class Subscription {
  constructor(id, artisId){
    this.id = id;
    this.artisId = artisId;
    this.subscriptors = [];
	}

}  

module.exports = Subscription;
