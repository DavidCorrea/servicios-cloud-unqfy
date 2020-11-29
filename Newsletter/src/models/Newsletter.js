require('dotenv').config();
require('dotenv').config();
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('../../src/clients/gmailClient');
const { NewsletterError, ResourceNotFoundError, RelatedResourceNotFoundError, ResourceAlreadyExistsError, BadRequestError } = require('./NewsletterError');
const ArtistSubscription = require('./ArtistSubscription');
const UNQfy = require('../clients/UNQfyClient');

const gmailClient = getGmailClient();

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  async subscribe(artistId, email) {
    try{
      await UNQfy.validateArtistExistanceById(artistId)
      let subscription = this.getArtistSubscriptions(artistId);
      subscription.addSubscriptor(email);
    } catch(err){
      if(err instanceof ResourceNotFoundError) {
        throw new RelatedResourceNotFoundError('Artist');
      } else {
        throw err;
      }
    }
  }

  unsubscribe(artistId, email) {
    let subscription = this.getArtistSubscriptions(artistId);
    subscription.removeSubscriptor(email);
  }

  notify(artistId) {
    throw new Error("Not implemented");
  }

  getArtistSubscriptions(artistId){
    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId)[0];
    if(!subscription){
	    subscription = new ArtistSubscription(artistId);
      this.subscriptions.push(subscription);
    }
    return subscription;
	}

  deleteSubscriptionsForArtist(artistId) {
    this.subscriptions = this.subscriptions.filter(subscription => subscription.artistId !== artistId);
  }

  notify(artistId, subject, text){
    let artistSubscription = this.getArtistSubscriptions(artistId);
    artistSubscription.subscriptors.forEach(email => {this.sendEmail(email, process.env.EMAIL_FROM, subject, text)})
  }
  
  sendEmail(emailTo, emailFrom, subject, text){
    gmailClient.users.messages.send({
      userId: 'me',
      requestBody: {raw: this.createMessage(emailTo, emailFrom, subject, text),},
    });
  }

  createMessage(emailTo, emailFrom, subject, text) {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      'From: ' + emailFrom,
      'To: ' + emailTo,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      subject,
      text,
    ];
    const message = messageParts.join('\n');
  
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    return encodedMessage;
  }

}

module.exports = Newsletter;
