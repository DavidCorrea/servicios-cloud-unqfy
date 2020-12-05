const UNQfy = require('../clients/UNQfyClient');
const timer = ms => new Promise( res => setTimeout(res, ms));



class Monitor {
  constructor(delay) {
    this.delay = delay
  }

  async checkStatus(previousState){
    let status = await UNQfy.validateArtistExistanceById(0)
    if( status !== previousState){
      console.log(status ? "esta vivo!!" : "se muro :'(");
    }
    await timer(this.delay);
    this.checkStatus(status);
  }
}

module.exports = Monitor;
