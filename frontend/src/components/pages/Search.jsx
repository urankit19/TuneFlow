
import { useState } from "react";
import { Search as SearchIcon, Play } from "lucide-react";
import toast from "react-hot-toast";

import useMusicStore from "../../store/musicStore";
import { searchTracks } from "../../services/musicService";

export default function Search() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const playTrack = useMusicStore((state) => state.playTrack);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query.trim().length < 2) {
      toast.error("Enter at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const results = await searchTracks(query.trim());

      setTracks(results || []);

      if (!results?.length) {
        toast("No tracks found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to search music"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    if (!track.playback?.available) {
      toast.error("This track is not available for streaming");
      return;
    }

    playTrack(track, tracks);
  };

  const formatDuration = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-7">

      <h1 className="text-3xl font-bold">Search Music</h1>

      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white text-black rounded-full px-4 py-3 max-w-xl"
      >
        <SearchIcon size={22} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs or artists..."
          className="bg-transparent outline-none px-3 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="font-bold disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="space-y-3">

        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-[#202020] hover:bg-[#303030] transition"
          >
            <img
              src={track.artwork || "/placeholder-music.png"}
              alt={track.title}
              className="w-14 h-14 rounded object-cover bg-gray-700"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {track.title}
              </h3>

              <p className="text-sm text-gray-400 truncate">
                {track.artist?.name || "Unknown Artist"}
              </p>

              <p className="text-xs text-gray-500">
                Audius · Full track where streamable
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {formatDuration(track.duration)}
            </span>

            <button
              disabled={!track.playback?.available}
              onClick={() => handlePlay(track)}
              title={
                track.playback?.available
                  ? "Play track"
                  : "Track unavailable"
              }
              className="bg-green-500 text-black p-3 rounded-full hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play size={18} fill="currentColor" />
            </button>
          </div>
        ))}

        {searched && !loading && tracks.length === 0 && (
          <p className="text-gray-400">
            No results available.
          </p>
        )}

      </div>

    </div>
  );
}
