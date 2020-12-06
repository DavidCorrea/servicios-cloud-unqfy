const axios = require('axios');

class LoggingClient {
  constructor() {
    this.client = axios.create({ baseURL: LoggingClient.baseURL() });
  }

  static baseURL() {
    return process.env.LOGGING_CLIENT_BASE_URL || 'http://localhost:3003';
  }

  async update(observable, { action, object }) {
    const updatedObjectType = observable.constructor.name.toLowerCase();
    const objectType = object.constructor.name.toLowerCase();
    const message = `${updatedObjectType}.${action}.${objectType}`;
    const serializedObject = object.serialize();

    try {
      await this.client.post('/api/log', { message, object: serializedObject });
    } catch (err) {
      // We don't really care if it fails. We should log the failure and that's it.
    }
  }
}

module.exports = LoggingClient;
