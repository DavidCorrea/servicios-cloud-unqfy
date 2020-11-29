const DATA_FILENAME = 'data.json';
const fs = require('fs');
const Newsletter = require('../models/Newsletter');

module.exports = {
  getNewsletter: () => {
		let newsletter = new Newsletter();

		if (fs.existsSync(DATA_FILENAME)) {
			newsletter = Newsletter.load(DATA_FILENAME);
		}

		return newsletter;
	},
  saveNewsletter: (newsletter) => {
	newsletter.save(DATA_FILENAME);
  }
}
