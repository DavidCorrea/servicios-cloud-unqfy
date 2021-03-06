const express = require('express');
const router = express.Router();

router.post('/switch', async (req, res, next) => {
	try{
		let result = req.monitor.switch()
		res.status(200).send({ monitoring: result });
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
