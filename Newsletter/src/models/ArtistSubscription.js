class ArtistSubscription {
  constructor(artistId){
    this.artistId = artistId;
    this.subscriptors = [];
	}

  addSubscriptor(email){
    this.subscriptors.push(email);
  }

  removeSubscriptor(email){
    this.subscriptors = this.subscriptors.filter(emailSubscriptor => emailSubscriptor !== email);
  }

}  

module.exports = ArtistSubscription;
