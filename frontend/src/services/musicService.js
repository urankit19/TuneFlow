import api from "./api";

export const searchTracks = async (query) => {
  const response = await api.get("/music/search", {
    params: { q: query }
  });

  return response.data.data;
};

export const getTrendingTracks = async () => {
  const response = await api.get("/music/trending");

  return response.data.data;
};

export const getStreamUrl = (trackId) => {
  return `${import.meta.env.VITE_API_BASE_URL}/music/${encodeURIComponent(trackId)}/stream`;
};