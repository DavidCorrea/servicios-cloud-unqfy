const axios = require('axios');

class NewsletterClient {
  constructor() {
    this.client = axios.create({ baseURL: NewsletterClient.baseURL() });
  }

  static baseURL() {
    return process.env.NEWSLETTER_CLIENT_BASE_URL || 'http://localhost:3001';
  }

  async update(artist, albumName) {
    const subject = `${artist.name} has released a new album!`;
    const message = `Listen now to ${artist.name}'s latest album, "${albumName}"`;

    try {
      await this.client.post('/api/notify', { artistId: artist.id, subject, message });
    } catch (err) {
      // We don't really care if it fails. We should log the failure and that's it.
    }
  }
}

module.exports = NewsletterClient;
