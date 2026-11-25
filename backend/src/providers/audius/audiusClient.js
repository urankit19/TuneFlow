const axios = require("axios");

const headers = {};

if (process.env.AUDIUS_API_KEY) {
  headers["x-api-key"] = process.env.AUDIUS_API_KEY;
}

const audiusClient = axios.create({
  baseURL:
    process.env.AUDIUS_API_BASE_URL ||
    "https://api.audius.co/v1",
  timeout: 20000,
  headers,
});

const get = async (url, params = {}) => {
  const response = await audiusClient.get(url, { params });
  return response.data.data;
};

const getStream = async (trackId, range) => {
  return audiusClient.get(
    `/tracks/${encodeURIComponent(trackId)}/stream`,
    {
      responseType: "stream",
      maxRedirects: 5,
      timeout: 30000,
      headers: range ? { Range: range } : {},
      validateStatus: (status) => status === 200 || status === 206,
    }
  );
};

module.exports = {
  get,
  getStream,
};