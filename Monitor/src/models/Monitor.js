const UNQfy = require('../clients/UNQfyClient');
const Newsletter = require('../clients/NewsletterClient');
const Discord = require('../clients/DiscordClient');
const timer = ms => new Promise( res => setTimeout(res, ms));



class Monitor {
  constructor(delay) {
    this.delay = delay;
    this.running = true;
    this.livenessDetections = {
      UNQfy: undefined,
      Newsletter: undefined,
    };
  }

  async livenessChecks(){
    if(this.running){
      await this.UNQfyLivenessDetection();
      await this.NewsletterLivenessDetection();
    }
    await timer(this.delay);
    this.livenessChecks();
  }

  async UNQfyLivenessDetection() {
    let liveness = await UNQfy.UNQfyLivenessDetection();
    if (liveness !== this.livenessDetections.UNQfy) {
      let message = `[${new Date().toTimeString()}] el servicio UNQfy ha ${liveness ? 'vuelto a' : 'dejado de'} funcionar`;
      Discord.discordNotify(message)
      console.log(message);
    }
    this.livenessDetections.UNQfy = liveness;
  }
  
  async NewsletterLivenessDetection() {
    let liveness = await Newsletter.NewsletterLivenessDetection();
    if (liveness !== this.livenessDetections.Newsletter) {
      let message = `[${new Date().toTimeString()}] el servicio Newsletter ha ${liveness ? 'vuelto a' : 'dejado de'} funcionar`;
      Discord.discordNotify(message)
      console.log(message);
    }
    this.livenessDetections.Newsletter = liveness;
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
