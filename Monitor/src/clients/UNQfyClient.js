
const axios = require('axios');

const UNQfyBaseURL = process.env.UNQfyBaseURL || "http://localhost:3000";

const unqfy = axios.create({
  baseURL:UNQfyBaseURL
});

const UNQfyLivenessDetection = async () => {
  try{
    let res = await unqfy.get('/api/heartbeat');
    return res.status === 200;
  } catch(err) {
    return false;
  };
};

module.exports = {
  UNQfyLivenessDetection
};
