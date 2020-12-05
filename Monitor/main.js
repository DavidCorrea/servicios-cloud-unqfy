const Monitor = require('./src/models/Monitor');

const DELAY = 15000;


function main() {
  const monitor = new Monitor(DELAY);
  monitor.checkStatus();
}

main();
