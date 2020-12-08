const axios = require('axios');

class NewsletterClient {
  constructor() {
    this.client = axios.create({ baseURL: NewsletterClient.baseURL() });
  }

  static baseURL() {
    return process.env.NEWSLETTER_API_HOST || 'http://localhost:3001';
  }

  async update(artist, { object }) {
    const subject = `${artist.name} has released a new album!`;
    const message = `Listen now to ${artist.name}'s latest album, "${object.name}"`;

    try {
      await this.client.post('/api/notify', { artistId: artist.id, subject, message });
    } catch (err) {
      console.log(`Could not connect with Newsletter Service: ${err.message}`);
    }
  }
}

module.exports = NewsletterClient;
