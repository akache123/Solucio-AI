// scripts/get_a_lot_of_embeddings.js
const axios = require('axios');

async function callLoadDataEndpoint(latitude, longitude) {
  try {
    const response = await axios.get('http://localhost:3000/api/load_data', {
      params: { latitude, longitude }
    });
    console.log(`Data for location (${latitude}, ${longitude}):`, response.data);
  } catch (error) {
    console.error(`Error fetching data for location (${latitude}, ${longitude}):`, error);
  }
}

async function main() {
  const locations = [
    { latitude: '37.7749', longitude: '-122.4194' }, // San Francisco
    { latitude: '34.0522', longitude: '-118.2437' }  // Los Angeles
  ];

  for (const location of locations) {
    await callLoadDataEndpoint(location.latitude, location.longitude);
  }
}

main();
