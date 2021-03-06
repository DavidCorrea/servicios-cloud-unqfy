const axios = require('axios');
const {ResourceNotFoundError} = require('../models/NewsletterError');

const UNQfyBaseURL = process.env.UNQFY_API_HOST || "http://localhost:3000";

const unqfy = axios.create({
  baseURL:UNQfyBaseURL
});

const validateArtistExistanceById = async (artistId) => {
  try{
    await unqfy.get('/api/artists/'+ artistId);
  } catch(err) {
    if(err.response && err.response.status === 404){
      throw new ResourceNotFoundError("Artist")
    } else {
      throw err;
    }
  };
};

module.exports = {
  validateArtistExistanceById
};
