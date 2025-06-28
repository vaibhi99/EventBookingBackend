require("dotenv").config();
const ngrok = require("@ngrok/ngrok");

function startNgrok(PORT) {
  ngrok.connect({
    addr: PORT,
    authtoken: process.env.NGROK_AUTHTOKEN 
  })
  .then(listener => {
    console.log(`Ngrok tunnel established at: ${listener.url()}`);
  })
  .catch(err => {
    console.error('Ngrok error:', err);
  });
}


module.exports = startNgrok;