const axios = require('axios');

const discord = axios.create({});

const discordNotify = async (message) => {
  try{
    let res = await discord.post(process.env.DiscordURL,{
        content: message
      });
  } catch(err) {
    console.log(err)
  };
};

module.exports = {
  discordNotify
};
