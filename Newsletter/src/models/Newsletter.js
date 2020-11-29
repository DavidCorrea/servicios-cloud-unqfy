const picklify = require('picklify');
const fs = require('fs');
const getGmailClient = require('../../src/clients/gmailClient');
const { ResourceNotFoundError, RelatedResourceNotFoundError, BadRequestError } = require('./NewsletterError');
const ArtistSubscription = require('./ArtistSubscription');
const UNQfy = require('../clients/UNQfyClient');

const gmailClient = getGmailClient();

class Newsletter {
  constructor() {
    this.subscriptions = [];
  }

  async subscribe(artistId, email) {
    this._validateIsNotEmpty(artistId, 'artistId');
    this._validateIsNotEmpty(email, 'email');

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
    this._validateIsNotEmpty(artistId, 'artistId');
    this._validateIsNotEmpty(email, 'email');

    let subscription = this.getArtistSubscriptions(artistId);
    subscription.removeSubscriptor(email);
  }

  getArtistSubscriptions(artistId){
    this._validateIsNotEmpty(artistId, 'artistId');

    let subscription = this.subscriptions.filter(subcription => subcription.artistId == artistId)[0];
    if(!subscription){
	    subscription = new ArtistSubscription(artistId);
      this.subscriptions.push(subscription);
    }
    return subscription;
	}

  deleteSubscriptionsForArtist(artistId) {
    this._validateIsNotEmpty(artistId, 'artistId');

    this.subscriptions = this.subscriptions.filter(subscription => subscription.artistId !== artistId);
  }

  notify(artistId, subject, text){
    this._validateIsNotEmpty(artistId, 'artistId');
    this._validateIsNotEmpty(subject, 'subject');
    this._validateIsNotEmpty(text, 'message');

    let artistSubscription = this.getArtistSubscriptions(artistId);
    artistSubscription.subscriptors.forEach(email => {this._sendEmail(email, process.env.EMAIL_FROM, subject, text)})
  }
  
  _sendEmail(emailTo, emailFrom, subject, text){
    gmailClient.users.messages.send({
      userId: 'me',
      requestBody: {raw: this._createMessage(emailTo, emailFrom, subject, text),},
    });
  }

  _createMessage(emailTo, emailFrom, subject, text) {
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

  _validateIsNotEmpty(value, errorMessageParameter) {
    if (value.length === 0) {
      throw new BadRequestError(`${errorMessageParameter} cannot be empty`);
    }
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [Newsletter, ArtistSubscription];

    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = Newsletter;
