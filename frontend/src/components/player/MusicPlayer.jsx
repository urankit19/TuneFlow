
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  ListMusic,
} from "lucide-react";
import toast from "react-hot-toast";

import useMusicStore from "../../store/musicStore";
import { getStreamUrl } from "../../services/musicService";

const formatTime = (seconds = 0) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [showQueue, setShowQueue] = useState(false);

  // Store state
  const queue = useMusicStore((state) => state.queue);
  const currentIndex = useMusicStore((state) => state.currentIndex);

  const isPlaying = useMusicStore((state) => state.isPlaying);
  const currentTime = useMusicStore((state) => state.currentTime);
  const duration = useMusicStore((state) => state.duration);
  const volume = useMusicStore((state) => state.volume);
  const isShuffle = useMusicStore((state) => state.isShuffle);
  const repeatMode = useMusicStore((state) => state.repeatMode);

  // Store actions
  const togglePlay = useMusicStore((state) => state.togglePlay);
  const setPlaying = useMusicStore((state) => state.setPlaying);
  const setCurrentTime = useMusicStore((state) => state.setCurrentTime);
  const setDuration = useMusicStore((state) => state.setDuration);
  const setVolume = useMusicStore((state) => state.setVolume);
  const nextTrack = useMusicStore((state) => state.nextTrack);
  const previousTrack = useMusicStore((state) => state.previousTrack);
  const toggleShuffle = useMusicStore((state) => state.toggleShuffle);
  const cycleRepeat = useMusicStore((state) => state.cycleRepeat);
  const selectQueueTrack = useMusicStore(
    (state) => state.selectQueueTrack
  );

  const currentTrack = queue[currentIndex] || null;

  // 1. Load track and synchronize playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const loadAndPlay = async () => {
      if (!currentTrack) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();

        setCurrentTime(0);
        setDuration(0);
        return;
      }

      const trackId = currentTrack.externalId || currentTrack.id;

      if (!trackId) {
        console.error("Track ID missing:", currentTrack);
        setPlaying(false);
        toast.error("Invalid track information");
        return;
      }

      const streamUrl = getStreamUrl(trackId);

      // Change source only when the selected track changes
      if (audio.src !== new URL(streamUrl, window.location.href).href) {
        audio.pause();
        audio.src = streamUrl;
        audio.load();

        setCurrentTime(0);
        setDuration(0);
      }

      if (isPlaying) {
        try {
          await audio.play();

          if (!cancelled) {
            console.log("Now playing:", currentTrack.title);
          }
        } catch (error) {
          if (cancelled || error.name === "AbortError") return;

          console.error("Audio playback error:", error);
          console.error("Stream URL:", streamUrl);

          setPlaying(false);
          toast.error("Unable to play this track");
        }
      } else {
        audio.pause();
      }
    };

    loadAndPlay();

    return () => {
      cancelled = true;
    };
  }, [
    currentTrack?.id,
    currentTrack?.externalId,
    isPlaying,
    setPlaying,
    setCurrentTime,
    setDuration,
  ]);

  // 2. Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 3. Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      const mode = useMusicStore.getState().repeatMode;

      if (mode === "one") {
        audio.currentTime = 0;

        audio.play().catch((error) => {
          console.error("Repeat playback error:", error);
          setPlaying(false);
        });
      } else {
        nextTrack();
      }
    };

    const handleError = () => {
      console.error("Audio element error:", {
        error: audio.error,
        code: audio.error?.code,
        message: audio.error?.message,
        source: audio.currentSrc,
      });

      setPlaying(false);
      toast.error("This track could not be loaded");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [nextTrack, setCurrentTime, setDuration, setPlaying]);

  // 4. Seek handler
  const handleSeek = (event) => {
    const value = Number(event.target.value);
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(value)) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  // 5. Previous track handler
  const handlePrevious = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const result = previousTrack(audio.currentTime || 0);

    if (result === "restart") {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // 6. Play / Pause handler
  const handlePlayPause = () => {
    if (!currentTrack) {
      toast("Select a track first");
      return;
    }

    togglePlay();
  };

  return (
    <>
      {/* Global audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Queue panel */}
      {showQueue && (
        <div className="fixed bottom-24 right-5 z-50 max-h-80 w-80 overflow-y-auto rounded-xl border border-white/10 bg-[#181818] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Playing Queue
            </h3>

            <button
              onClick={() => setShowQueue(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {queue.length === 0 ? (
            <p className="text-sm text-gray-400">
              Your queue is empty.
            </p>
          ) : (
            queue.map((track, index) => (
              <button
                key={track.id}
                onClick={() => selectQueueTrack(index)}
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/10 ${
                  index === currentIndex ? "bg-white/10" : ""
                }`}
              >
                <img
                  src={track.artwork || "/placeholder-music.png"}
                  alt={track.title}
                  className="h-10 w-10 rounded object-cover"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-white">
                    {track.title}
                  </span>

                  <span className="block truncate text-xs text-gray-400">
                    {track.artist?.name || "Unknown Artist"}
                  </span>
                </span>

                {index === currentIndex && (
                  <span className="text-xs text-green-400">
                    Playing
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Global player */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#111] px-4 py-3 text-white">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-3 items-center gap-4">

          {/* Track information */}
          <div className="flex min-w-0 items-center gap-3">
            {currentTrack ? (
              <>
                <img
                  src={currentTrack.artwork || "/placeholder-music.png"}
                  alt={currentTrack.title}
                  className="h-12 w-12 rounded object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {currentTrack.title}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {currentTrack.artist?.name || "Unknown Artist"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Select a song to start listening.
              </p>
            )}
          </div>

          {/* Playback controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-5">

              <button
                onClick={toggleShuffle}
                disabled={!currentTrack}
                title="Shuffle"
                className={`disabled:opacity-40 ${
                  isShuffle ? "text-green-400" : "text-gray-400"
                }`}
              >
                <Shuffle size={17} />
              </button>

              <button
                onClick={handlePrevious}
                disabled={!currentTrack}
                title="Previous"
                className="disabled:opacity-40"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={handlePlayPause}
                disabled={!currentTrack}
                title={isPlaying ? "Pause" : "Play"}
                className="rounded-full bg-white p-2 text-black hover:scale-105 disabled:opacity-40"
              >
                {isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
              </button>

              <button
                onClick={nextTrack}
                disabled={!currentTrack}
                title="Next"
                className="disabled:opacity-40"
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={cycleRepeat}
                disabled={!currentTrack}
                title={`Repeat: ${repeatMode}`}
                className={`flex items-center disabled:opacity-40 ${
                  repeatMode !== "off"
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                <Repeat size={17} />

                {repeatMode === "one" && (
                  <span className="ml-0.5 text-[9px]">1</span>
                )}
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex w-full max-w-xl items-center gap-2 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                disabled={!currentTrack || !duration}
                className="h-1 flex-1 cursor-pointer accent-green-500 disabled:cursor-not-allowed"
                aria-label="Track progress"
              />

              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and queue */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowQueue((value) => !value)}
              title="Queue"
              className={showQueue ? "text-green-400" : "text-gray-400"}
            >
              <ListMusic size={20} />
            </button>

            {volume === 0 ? (
              <VolumeX size={19} className="text-gray-400" />
            ) : (
              <Volume2 size={19} className="text-gray-400" />
            )}

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) =>
                setVolume(Number(event.target.value))
              }
              className="w-24 cursor-pointer accent-green-500"
              aria-label="Volume"
            />
          </div>

        </div>
      </div>
    </>
  );
}

