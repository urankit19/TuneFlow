const audiusClient = require("./audiusClient");

const {
  normalizeTrack,
  normalizeTracks,
} = require("./audiusNormalizer");

// SEARCH TRACKS
const searchTracks = async (query, limit = 20, offset = 0) => {
  const tracks = await audiusClient.get("/tracks/search", {
    query,
    limit,
    offset,
  });

  return normalizeTracks(tracks);
};

// TRENDING TRACKS
const getTrending = async (limit = 20) => {
  const tracks = await audiusClient.get("/tracks/trending", {
    limit,
    time: "week",
  });

  return normalizeTracks(tracks);
};

// SINGLE TRACK DETAILS
const getTrack = async (trackId) => {
  const track = await audiusClient.get(
    `/tracks/${encodeURIComponent(trackId)}`
  );

  return normalizeTrack(track);
};

// STREAM TRACK
const getStream = async (trackId, range) =>
  audiusClient.getStream(trackId, range);

module.exports = {
  searchTracks,
  getTrending,
  getTrack,
  getStream,
};