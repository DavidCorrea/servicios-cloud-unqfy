const UNQfy = require('../clients/UNQfyClient');
const timer = ms => new Promise( res => setTimeout(res, ms));



class Monitor {
  constructor(delay) {
    this.delay = delay;
    this.running = true;
    this.livenessDetections = {
      UNQfy: false,
    };
  }

  async livenessChecks(){
    if(this.running){
      await this.UNQfyLivenessCheck();
    }
    await timer(this.delay);
    this.livenessChecks();
  }

  async UNQfyLivenessCheck() {
    let liveness = await UNQfy.validateArtistExistanceById(0);
    if (liveness !== this.livenessDetections.UNQfy) {
      console.log(liveness ? "UNQfy esta vivo!!" : "UNQfy se murio :'(");
    }
    this.livenessDetections.UNQfy = liveness;
  }

  getlivenessDetections(){
    return (this.running ? this.livenessDetections : {});
  }

  switch(status){
    this.running = status;
    return this.running;
  }
}

module.exports = Monitor;
