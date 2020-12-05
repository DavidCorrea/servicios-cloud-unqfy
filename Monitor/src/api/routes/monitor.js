const express = require('express');
const router = express.Router();
const Monitor = require('../../models/Monitor');

const monitor = new Monitor();

router.post('/switch', async (req, res, next) => {
	try{
	let { status } = req.body;
		let result = req.monitor.switch(status)
		res.status(200).send(result);
	} catch(err) {
    next(err);
  }
});


router.get('/livenessDetections', async (req, res, next) => {
  try{
    let livenessDetections = req.monitor.getlivenessDetections();
    res.status(200).send(livenessDetections);
	} catch(err) {
    next(err);
  }
});

module.exports = router;
