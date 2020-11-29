const axios = require('axios');

const UNQfyBaseURL = process.env.UNQfyBaseURL || "http://localhost:3000";


const unqfy = axios.create({
  baseURL:UNQfyBaseURL
});

const validateArtistExistanceById = async (artistId) => {
  try{
    await unqfy.get('/api/artists/'+ artistId);
  }catch(err) {
    if(err.response && err.response.status === 404){
      throw new Error("No existe el artista.")
    }else {
      throw err;
    }
  };
};

module.exports = {
  validateArtistExistanceById
};
