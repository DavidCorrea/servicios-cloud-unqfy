const DATA_FILENAME = 'data.json';
const fs = require('fs');
const UNQfy = require('./unqfy');

module.exports = {
  getUNQfy: () => {
		let unqfy = new UNQfy();

		if (fs.existsSync(DATA_FILENAME)) {
			unqfy = UNQfy.load(DATA_FILENAME);
		}

		return unqfy;
	},
  saveUNQfy: (unqfy) => {
		unqfy.save(DATA_FILENAME);
  }
}
