const QRCode = require('qrcode');

async function generateTicketQRCode(ticketData) {
  try {
    const qr = await QRCode.toDataURL(ticketData); 
    return qr; 
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = generateTicketQRCode;