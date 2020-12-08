const axios = require('axios');

class LoggingClient {
  constructor() {
    this.client = axios.create({ baseURL: LoggingClient.baseURL() });
  }

  static baseURL() {
    return process.env.LOGGING_API_HOST || 'http://localhost:3003';
  }

  async update(observable, { action, object }) {
    const updatedObjectType = observable.constructor.name.toLowerCase();
    const objectType = object.constructor.name.toLowerCase();
    const message = `${updatedObjectType}.${action}.${objectType}`;
    const serializedObject = object.serialize();

    try {
      await this.client.post('/api/log', { message, object: serializedObject });
    } catch (err) {
      console.log(`Could not connect with Logging Service: ${err.message}`);
    }
  }
}

module.exports = LoggingClient;
