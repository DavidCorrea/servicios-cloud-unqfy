
const axios = require('axios');

const NewsletterBaseURL = process.env.NewsletterBaseURL || "http://localhost:3001";

const unqfy = axios.create({
  baseURL:NewsletterBaseURL
});

const NewsletterLivenessDetection = async () => {
  try{
    let res = await unqfy.get('/api/heartbeat');
    return res.status === 200;
  } catch(err) {
    return false;
  };
};

module.exports = {
  NewsletterLivenessDetection
};
