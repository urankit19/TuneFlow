const audiusClient = require("./audiusClient");

const normalizeAudiusTrack = require("./audiusNormalizer");

const audiusAdapter = {

  // Search tracks
  async searchTracks(query, limit = 20, offset = 0) {
    const response = await audiusClient.get("/tracks/search", {
      params: {
        query,
        limit,
        offset
      }
    });

    const tracks = response.data?.data || [];

    return tracks
      .map(normalizeAudiusTrack)
      .filter(Boolean);
  },

  // Trending tracks
  async getTrending(limit = 20) {
    const response = await audiusClient.get("/tracks/trending", {
      params: { limit }
    });

    const tracks = response.data?.data || [];

    return tracks
      .map(normalizeAudiusTrack)
      .filter(Boolean);
  },

  // Get individual track
  async getTrack(trackId) {
    const response = await audiusClient.get(
      `/tracks/${encodeURIComponent(trackId)}`
    );

    return normalizeAudiusTrack(response.data?.data);
  },

  // Get provider stream endpoint
  async getStream(trackId) {
  return audiusClient.get(
    `/tracks/${encodeURIComponent(trackId)}/stream`,
    {
      responseType: "stream",
      maxRedirects: 0,

      validateStatus: (status) =>
        status >= 200 && status < 400
    }
  );
}
};

module.exports = audiusAdapter;