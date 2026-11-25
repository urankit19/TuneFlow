const normalizeTrack = (track) => {
  if (!track) return null;

  const artist = track.user || {};

  const artwork =
    track.artwork?.["480x480"] ||
    track.artwork?.["150x150"] ||
    null;

  const available =
    track.is_streamable === true &&
    track.access?.stream !== false;

  return {
    id: String(track.id),
    externalId: String(track.id),

    title: track.title || "Unknown Track",

    artist: {
      id: artist.id || null,
      name: artist.name || artist.handle || "Unknown Artist",
    },

    artwork,

    duration: Number(track.duration) || 0,

    playback: {
      available,
    },

    source: "audius",
  };
};

const normalizeTracks = (tracks = []) =>
  tracks.map(normalizeTrack).filter(Boolean);

module.exports = {
  normalizeTrack,
  normalizeTracks,
};