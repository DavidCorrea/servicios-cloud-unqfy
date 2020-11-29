const nock = require('nock');
const NewsletterClient = require('../../src/clients/NewsletterClient')

const mockAnySuccessfulNewAlbumNotificationRequest = () => {
  nock.cleanAll();

  nock(NewsletterClient.baseURL())
    .persist()
    .post('/api/notify', body => true)
    .reply(200);
};

const mockSuccessfulNewAlbumNotificationRequest = (artistId, subject, message) => {
  nock.cleanAll();

  return nock(NewsletterClient.baseURL())
    .post('/api/notify', { artistId, subject, message })
    .reply(200);
};

module.exports = {
  mockAnySuccessfulNewAlbumNotificationRequest,
  mockSuccessfulNewAlbumNotificationRequest
};
