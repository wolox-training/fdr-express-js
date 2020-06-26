const axios = require('axios');
const config = require('../../config');

exports.getRandomQuote = () => axios.get(`${config.quoteApi.baseUrl}/quotes/random`);
