const axios = require("axios");

const audiusClient = axios.create({
  baseURL: process.env.AUDIUS_BASE_URL ||
    "https://api.audius.co/v1",

  timeout: 15000,

  headers: {
    "x-api-key": process.env.AUDIUS_API_KEY
  }
});

module.exports = audiusClient;