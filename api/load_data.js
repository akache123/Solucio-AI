const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { Configuration, OpenAI } = require('openai');

const app = express();
const PORT = 3000;

const client = new OpenAI(({
  apiKey: process.env.OPEN_AI_KEY
}));

app.use(express.static('public'));

app.get('/api/restaurants', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).send('Latitude and longitude are required');
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
  let results = [];
  let pageToken = null;

  try {
    do {
      const params = {
        location: `${latitude},${longitude}`,
        radius: '2500',
        type: 'restaurant',
        key: apiKey,
        pagetoken: pageToken
      };

      const response = await axios.get(searchUrl, { params });
      results = results.concat(response.data.results);
      pageToken = response.data.next_page_token;

      // Google API requires a short delay before requesting the next page
      if (pageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (pageToken && results.length < 50);

    // Fetch detailed information
    results = await Promise.all(results.map(async (restaurant) => {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,rating,formatted_address,website&key=${apiKey}`;
      const detailResponse = await axios.get(detailsUrl);
      const { name, rating, formatted_address, website } = detailResponse.data.result;
      return { name, rating, address: formatted_address, website };
    }));

    await splitAndSendToOpenAI(results); // Split and send results to OpenAI

    res.json({ results });
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    res.status(500).send('Failed to fetch restaurant data');
  }
});

const splitAndSendToOpenAI = async (results) => {
  const chunkSize = 20;
  const promptTemplate = `give me 20 of each of their menu items, exactly what is in it, no generalities
give it in a raw json format, with 20 attributes to them ranging from cuisine to taste to spice level to anything else you can possibly think of. make sure to add the name of the place, its ratings, prices, and the website as a part of the json ALWAYS!`;

  for (let i = 0; i < results.length; i += chunkSize) {
    const chunk = results.slice(i, i + chunkSize);
    const prompt = `${promptTemplate}\n${JSON.stringify(chunk)}`;

    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
      });

      console.log(response.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching OpenAI completion:', error);
    }
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
