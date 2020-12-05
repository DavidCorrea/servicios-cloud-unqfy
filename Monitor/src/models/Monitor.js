const UNQfy = require('../clients/UNQfyClient');
const timer = ms => new Promise( res => setTimeout(res, ms));



class Monitor {
  constructor(delay) {
    this.delay = delay;
    this.running = true;
    this.livenessDetections = {
      UNQfy: undefined,
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
    let liveness = await UNQfy.UNQfyLivenessDetection();
    if (liveness !== this.livenessDetections.UNQfy) {
      let message = `[${new Date().toTimeString()}] el servicio UNQfy ha ${liveness ? 'vuelto a' : 'dejado de'} funcionar`
      console.log(message);
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
