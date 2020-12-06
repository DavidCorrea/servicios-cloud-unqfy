const UNQfy = require('../clients/UNQfyClient');
const Newsletter = require('../clients/NewsletterClient');
const Discord = require('../clients/DiscordClient');



class Monitor {
  constructor() {
    this.interval = 15000;
    this.running = true;
    this.livenessDetections = {
      UNQfy: undefined,
      Newsletter: undefined,
    };
    this.timer = this.turnOn();
  }

   async livenessChecks(){
    await this.UNQfyLivenessDetection();
    await this.NewsletterLivenessDetection();
  }

  turnOn(){
    setInterval(async ()=>{await this.livenessChecks()},this.interval);
  }

  turnOff(){
    clearInterval(this.timer);
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
    if(this.running !== status){
      status ? this.turnOn() : this.turnOff();
      this.running = status;
    }
    return this.running;
  }
}

module.exports = Monitor;
