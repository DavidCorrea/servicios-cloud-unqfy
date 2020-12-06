const axios = require('axios');

const discord = axios.create({});

const discordNotify = async (serviceName, liveness) => {
  try{
    let message = `[${new Date().toTimeString()}] el servicio ${serviceName} ha ${liveness ? 'vuelto a' : 'dejado de'} funcionar`;
    console.log(message);
    await discord.post(process.env.DISCORD_URL,{
      content: message
    });
  } catch(err) {
    console.log(err)
  };
};

module.exports = {
  discordNotify
};
