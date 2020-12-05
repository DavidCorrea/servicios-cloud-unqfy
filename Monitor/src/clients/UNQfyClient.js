
const axios = require('axios');

const UNQfyBaseURL = process.env.UNQfyBaseURL || "http://localhost:3000";

const unqfy = axios.create({
  baseURL:UNQfyBaseURL
});

const validateArtistExistanceById = async (artistId) => {
  try{
    await unqfy.get('/api/artists/'+ artistId);
    return true;
  } catch(err) {
    return false;
  };
};

module.exports = {
  validateArtistExistanceById
};
