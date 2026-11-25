const audiusAdapter = require("../providers/audius/audiusAdapter");

// SEARCH MUSIC
exports.searchMusic = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();

    if (!query || query.length < 2 || query.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Search query must contain 2-100 characters"
      });
    }

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      50
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    const tracks = await audiusAdapter.searchTracks(
      query,
      limit,
      offset
    );

    res.json({
      success: true,
      provider: "audius",
      count: tracks.length,
      data: tracks
    });

  } catch (error) {
    next(error);
  }
};

// TRENDING MUSIC
exports.getTrending = async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      50
    );

    const tracks = await audiusAdapter.getTrending(limit);

    res.json({
      success: true,
      provider: "audius",
      count: tracks.length,
      data: tracks
    });

  } catch (error) {
    next(error);
  }
};

// GET TRACK DETAILS
exports.getTrack = async (req, res, next) => {
  try {
    const track = await audiusAdapter.getTrack(
      req.params.trackId
    );

    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found"
      });
    }

    res.json({
      success: true,
      data: track
    });

  } catch (error) {
    next(error);
  }
};

// STREAM TRACK


exports.streamTrack = async (req, res, next) => {
  try {
    const track = await audiusAdapter.getTrack(req.params.trackId);

    if (!track || !track.playback?.available) {
      return res.status(404).json({
        success: false,
        message: "Track is not available for streaming",
      });
    }

    // Forward browser's Range request to Audius
    const range = req.headers.range;

    const streamResponse = await audiusAdapter.getStream(
      req.params.trackId,
      range
    );

    const upstreamHeaders = streamResponse.headers;

    res.status(streamResponse.status || 200);

    res.setHeader(
      "Content-Type",
      upstreamHeaders["content-type"] || "audio/mpeg"
    );

    res.setHeader(
      "Cross-Origin-Resource-Policy",
      "cross-origin"
    );

    res.setHeader("Cache-Control", "no-store");

    // Preserve range response headers
    if (upstreamHeaders["content-range"]) {
      res.setHeader(
        "Content-Range",
        upstreamHeaders["content-range"]
      );
    }

    if (upstreamHeaders["accept-ranges"]) {
      res.setHeader(
        "Accept-Ranges",
        upstreamHeaders["accept-ranges"]
      );
    }

    if (upstreamHeaders["content-length"]) {
      res.setHeader(
        "Content-Length",
        upstreamHeaders["content-length"]
      );
    }

    streamResponse.data.on("error", (error) => {
      console.error("Audio stream error:", error);

      if (!res.headersSent) {
        res.status(502).end();
      } else {
        res.destroy(error);
      }
    });

    res.on("close", () => {
      if (!res.writableEnded) {
        streamResponse.data.destroy();
      }
    });

    streamResponse.data.pipe(res);

  } catch (error) {
    console.error("Stream controller error:", error);
    next(error);
  }
};
