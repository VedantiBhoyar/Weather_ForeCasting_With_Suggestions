const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
    const fetchPkg = await import('node-fetch');
    if (!global.fetch) global.fetch = fetchPkg.default;
    if (!global.Headers) global.Headers = fetchPkg.Headers;
    if (!global.Request) global.Request = fetchPkg.Request;
    if (!global.Response) global.Response = fetchPkg.Response;
})();

const app = express();
app.use(cors());

// Use your actual API keys here
const WEATHER_API_KEY = '';
const GEMINI_API_KEY = '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generateAISuggestion = async (weatherData) => {
    try {
        const prompt = `Based on the following weather data, give a friendly and actionable suggestion in short.So that I can show that to user
                        Weather data: ${JSON.stringify(weatherData)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error generating AI suggestion:', error);
        return 'No suggestions available at the moment.';
    }

};

app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${WEATHER_API_KEY}`
        );
        const weatherData = weatherResponse.data;
        // Generate AI suggestion
        const suggestions = await generateAISuggestion(weatherData);
        res.status(200).json({ ...weatherData, suggestions });
    } catch (error) {
        console.error('Error fetching weather data or generating AI suggestion:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));