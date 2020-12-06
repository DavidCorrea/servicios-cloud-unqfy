const express = require('express');
const router = express.Router();
const logger = require('../../models/Logger');

router.get("/heartbeat",(req, res, next) => {
  res.status(200).send();
});

router.post('/log', async (req, res, next) => {
	try{
    const { message, object } = req.body;

    logger.info(message, object);
    
		res.status(200).send();
	} catch(err) {
    next(err);
  }
});

router.post('/switch', async (req, res, next) => {
	try{
    logger.switch();
    
		res.status(200).send({ active: logger.isActive() });
	} catch(err) {
    next(err);
  }
});

module.exports = router;
