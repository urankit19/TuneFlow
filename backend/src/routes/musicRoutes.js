const express = require("express");

const router = express.Router();

const {
  searchMusic,
  getTrending,
  getTrack,
  streamTrack
} = require("../controllers/musicController");

router.get("/search", searchMusic);

router.get("/trending", getTrending);

router.get("/:trackId/stream", streamTrack);

router.get("/:trackId", getTrack);

module.exports = router;