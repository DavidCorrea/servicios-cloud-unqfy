const serviceClient = require('../clients/ServiceClient');
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
    let liveness = await serviceClient.ServiceLivenessDetection(process.env.UNQfyBaseURL);
    if (liveness !== this.livenessDetections.UNQfy) {
      Discord.discordNotify('UNQfy',liveness)
    }
    this.livenessDetections.UNQfy = liveness;
  }
  
  async NewsletterLivenessDetection() {
    let liveness = await serviceClient.ServiceLivenessDetection(process.env.NewsletterBaseURL);
    if (liveness !== this.livenessDetections.Newsletter) {
      Discord.discordNotify('Newsletter',liveness)
    }
    this.livenessDetections.Newsletter = liveness;
  }

  getlivenessDetections(){
    return (this.running ? this.livenessDetections : {});
  }

  switch(){
    this.running = !this.running
    this.running ? this.turnOn() : this.turnOff();
    return this.running;
  }
}

module.exports = Monitor;
