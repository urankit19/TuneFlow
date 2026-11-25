const normalizeAudiusTrack = (track) => {
  if (!track) return null;

  return {
    id: `audius_${track.id}`,

    provider: "audius",

    externalId: String(track.id),

    title: track.title || "Unknown Track",

    artist: {
      id: track.user?.id || null,
      name: track.user?.name || "Unknown Artist"
    },

    artwork:
      track.artwork?.["1000x1000"] ||
      track.artwork?.["480x480"] ||
      track.artwork?.["150x150"] ||
      null,

    duration: track.duration || 0,

    genre: track.genre || "Unknown",

    mood: track.mood || null,

    language: track.language || null,

    permalink: track.permalink
      ? `https://audius.co${track.permalink}`
      : null,

    playback: {
      mode: "audio_stream",
      available: track.is_streamable === true
    }
  };
};

module.exports = normalizeAudiusTrack;