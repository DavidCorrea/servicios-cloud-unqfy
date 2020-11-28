const express = require('express');
const router = express.Router();
const Newsletter = require('../../models/Newsletter');
let newsletter = new Newsletter();

router.post('/subscribe', async (req, res, next) => {
	try{
		let { artistId, email } = req.body;
		newsletter.subscribe(Number(artistId), email);
		res.status(200).send();
	} catch(err){
		console.log(err)
		res.status(500).send(err);
	}
});

router.post('/unsubscribe', async (req, res, next) => {
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
  res.status(500).send("Not implemented")
});

router.get('/subscriptions', async (req, res, next) => {
	const artistId = req.query.artistId || '';

  try{
    let subscriptions = newsletter.getSubscriptions(Number(artistId));
    res.status(200).send(subscriptions);
  } catch(err) {
		console.log(err)
		res.status(500).send(err);
  }
});


router.delete('/subscriptions', async (req, res, next) => {
	try{
		let { artistId } = req.body;
		newsletter.deleteSubscriptions(Number(artistId));
		res.status(200).send();
	} catch(err){
		console.log(err)
		res.status(500).send(err);
	}
});



module.exports = router;
