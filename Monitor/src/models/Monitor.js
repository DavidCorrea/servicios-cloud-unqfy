const serviceClient = require('../clients/ServiceClient');
const Discord = require('../clients/DiscordClient');


class Monitor {
  constructor() {
    this.interval = 3000;
    this.running = true;
    this.livenessDetections = {};
    this.timer = undefined;
    this.turnOn();
  }

   async livenessChecks(){
    await this.livenessDetection(process.env.UNQFY_API_HOST, 'UNQfy');
    await this.livenessDetection(process.env.NEWSLETTER_API_HOST, 'Newsletter');
    await this.livenessDetection(process.env.LOGGING_API_HOST, 'Logging');
  }

  turnOn(){
    this.timer = setInterval(async ()=>{await this.livenessChecks()},this.interval);
  }

  turnOff(){
    clearInterval(this.timer);
  }

  async livenessDetection(baseURL, serviceName) {
    let liveness = await serviceClient.ServiceLivenessDetection(baseURL);
    if (liveness !== this.livenessDetections[serviceName]) {
      Discord.discordNotify(serviceName,liveness)
    }
    this.livenessDetections[serviceName] = liveness;
  }

  getlivenessDetections(){
    return (this.running ? this.livenessDetections : {});
  }

  switch(){
    this.running = !this.running
    this.running ? this.turnOn() : this.turnOff();
    console.log(`Monitor has been turned ${this.running ? 'on' : 'off'}.`);
    return this.running;
  }
}

module.exports = Monitor;
