const express = require('express');
const fetch = require('node-fetch');
// const requestIp = require('request-ip');
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware to check request origin
const checkOrigin = (req, res, next) => {
  const allowedOrigin = 'https://kawagi.vercel.app';
  const requestOrigin = req.headers.origin;
  
  if (requestOrigin !== allowedOrigin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};


app.get('/:ipAddress', async (req, res) => {
  const { ipAddress } = req.params;

  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching IP data:', error);
    res.status(500).json({ error: 'Failed to fetch IP data' });
  }
});

app.get('/', async (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.clientIp;

  try {
    const response = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching IP data:', error);
    res.status(500).json({ error: 'Failed to fetch IP data' });
  }
});

app.get('/api/supply', checkOrigin, (req, res) => {
  const apiKey = process.env.botkey;
  const chaId = process.env.chatid;

  const keys = {
    apiKey,
    chaId
  };

  res.json(keys);
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
