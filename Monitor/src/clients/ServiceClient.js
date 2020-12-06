
const axios = require('axios');

const ServiceLivenessDetection = async (baseURL) => {
  try{
    
    const service = axios.create({baseURL:baseURL});
    let res = await service.get('/api/heartbeat');
    return res.status === 200;
  } catch(err) {
    return false;
  };
};

module.exports = {
  ServiceLivenessDetection
};
