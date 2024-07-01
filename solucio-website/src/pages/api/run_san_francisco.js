// src/api/run_san_francisco.js
const axios = require('axios');

const latitude = '37.7749';
const longitude = '-122.4194';

async function runSanFrancisco() {
  const url = 'http://localhost:3000/api/load_data';
  try {
    const response = await axios.get(url, {
      params: {
        latitude,
        longitude
      }
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error running San Francisco data fetch:', error);
  }
}

runSanFrancisco();
