const express = require('express');
const router = express.Router();

router.post('/subscribe', async (req, res, next) => {
  const newsletter = req.newsletter;
	try{
    let { artistId, email } = req.body;
		await newsletter.subscribe(Number(artistId), email);
		res.status(200).send();
	} catch(err) {
    next(err);
  }
});

router.post('/unsubscribe', async (req, res, next) => {
  const newsletter = req.newsletter;
	try{
		let { artistId, email } = req.body;
		newsletter.unsubscribe(Number(artistId), email);
		res.status(200).send();
	} catch(err){
		console.log(err)
		res.status(500).send(err);
	}
});

router.post('/notify', async (req, res, next) => {
  const newsletter = req.newsletter;
	try{
		let { artistId, subject, message } = req.body;
		newsletter.notify(artistId, subject, message);
		res.status(200).send();
	} catch(err){
		console.log(err)
		res.status(500).send(err);
	}
});

router.get('/subscriptions', async (req, res, next) => {
  const newsletter = req.newsletter;
	const artistId = req.query.artistId || '';
  try{
    let subscriptions = newsletter.getArtistSubscriptions(Number(artistId));
    res.status(200).send(subscriptions);
  } catch(err) {
		console.log(err)
		res.status(500).send(err);
  }
});


router.delete('/subscriptions', async (req, res, next) => {
  const newsletter = req.newsletter;
	try{
		let { artistId } = req.body;
		newsletter.deleteSubscriptionsForArtist(Number(artistId));
		res.status(200).send();
	} catch(err){
		console.log(err)
		res.status(500).send(err);
	}
});

module.exports = router;
