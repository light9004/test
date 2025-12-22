// Import Express.js
const express = require('express');
const request = require('requests');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.ACCESS_TOKEN
const whatsappBusinessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  console.log(req.body.entry.changes.contactswa_id)


  const url = `https://graph.facebook.com/v24.0/${whatsappBusinessPhoneId}/messages`
  const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
  }
  const data = {
      "messaging_product": "whatsapp",
      "to": "919891047436",
      "text": {
        "preview_url": false,
        "body": "This is my response"
    }
  }
  
  const constresponse = requests.post(url, headers=headers, json=data, timeout=30)

  
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
