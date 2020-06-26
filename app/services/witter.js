const axios = require('axios');

exports.getRandomQuote = () => axios.get(`${process.env.WITTER_API}/quotes/random`);
