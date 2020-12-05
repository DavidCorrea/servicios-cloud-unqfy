const {ResourceAlreadyExistsError} = require('./NewsletterError');

class ArtistSubscription {
  constructor(artistId){
    this.artistId = artistId;
    this.subscriptors = [];
	}

  addSubscriptor(email){
    if (!this.subscriptors.some((emailSubscriptor) => emailSubscriptor === email)) {
      this.subscriptors.push(email);
    }else{
      throw new ResourceAlreadyExistsError('Subscription', 'email');
    }
  }

  removeSubscriptor(email){
    this.subscriptors = this.subscriptors.filter(emailSubscriptor => emailSubscriptor !== email);
  }

}  

module.exports = ArtistSubscription;
