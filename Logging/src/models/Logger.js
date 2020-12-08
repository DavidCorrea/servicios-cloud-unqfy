const winston  = require('winston');
const format = winston.format;
const { Loggly } = require('winston-loggly-bulk');

class Logger {
  constructor() {
    const messageFormat = format.printf(({ level, message, timestamp, object }) => `${timestamp} - [${level}]: ${message} - ${JSON.stringify(object)}`);
    const timestampFormat = format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' });

    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({ 
          format: format.combine(format.colorize(), timestampFormat, format.align(), messageFormat) 
        }),
        new winston.transports.File({ 
          filename: 'logs/unqfy.log',
          format: format.combine(timestampFormat, format.align(), messageFormat)
        }),
        new Loggly({
          token: process.env.LOGGLY_CUSTOMER_TOKEN, // Available in https://unqfyg10.loggly.com/tokens
          subdomain: "unqfyg10", 
          tags: ["UNQfy"], 
          json: true 
        })
      ]
    });
  }

  debug(message, object) {
    this._validateMessage(message);

    this.logger.debug(message, { object });
  }

  info(message, object) {
    this._validateMessage(message);

    this.logger.info(message, { object });
  }

  warn(message, object) {
    this._validateMessage(message);

    this.logger.warn(message, { object });
  }

  error(message, object) {
    this._validateMessage(message);

    this.logger.error(message, { object });
  }

  switch() {
    this.logger.silent = !this.logger.silent;
    console.log(`Logger has been turned ${this.logger.silent ? 'off' : 'on'}.`);
  }

  isActive() {
    return !this.logger.silent;
  }

  _validateMessage(message) {
    if(!message || message.length === 0) {
      throw new Error('Message cannot be empty.')
    }
  }
}

const instance = new Logger();
module.exports = instance;
