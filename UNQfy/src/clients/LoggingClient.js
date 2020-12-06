const axios = require('axios');

class LoggingClient {
  constructor() {
    this.client = axios.create({ baseURL: LoggingClient.baseURL() });
  }

  static baseURL() {
    return process.env.LOGGING_CLIENT_BASE_URL || 'http://localhost:3002';
  }

  async update(observable, { action, object }) {
    const capitalizedAction = action.toUpperCase();
    const updatedObjectType = observable.constructor.name;
    const objectType = object.constructor.name;
    const serializedObject = object.serialize();

    try {
      await this.client.post('/api/log', { updatedObjectType, action: capitalizedAction, objectType, serializedObject });
    } catch (err) {
      // We don't really care if it fails. We should log the failure and that's it.
    }
  }
}

module.exports = LoggingClient;
