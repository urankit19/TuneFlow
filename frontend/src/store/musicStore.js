
import { create } from "zustand";

const useMusicStore = create((set, get) => ({
  queue: [],
  currentIndex: -1,

  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  isShuffle: false,
  repeatMode: "off", // off | all | one

  // Play selected track and initialize queue
  playTrack: (track, tracks = []) => {
    if (!track) return;

    let queue = tracks.length ? [...tracks] : [track];

    let index = queue.findIndex(
      (item) => item.id === track.id
    );

    if (index === -1) {
      queue.unshift(track);
      index = 0;
    }

    set({
      queue,
      currentIndex: index,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  // Play / Pause
  togglePlay: () => {
    const { isPlaying, queue, currentIndex } = get();

    if (!queue[currentIndex]) return;

    set({ isPlaying: !isPlaying });
  },

  setPlaying: (value) => set({ isPlaying: value }),

  setCurrentTime: (value) =>
    set({ currentTime: value }),

  setDuration: (value) =>
    set({ duration: value }),

  setVolume: (value) =>
    set({
      volume: Math.max(0, Math.min(1, value)),
    }),

  // Shuffle
  toggleShuffle: () =>
    set((state) => ({
      isShuffle: !state.isShuffle,
    })),

  // Repeat: off -> all -> one -> off
  cycleRepeat: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === "off"
          ? "all"
          : state.repeatMode === "all"
          ? "one"
          : "off",
    })),

  // Next track
  nextTrack: () => {
    const {
      queue,
      currentIndex,
      isShuffle,
      repeatMode,
    } = get();

    if (!queue.length) return;

    if (isShuffle && queue.length > 1) {
      let nextIndex;

      do {
        nextIndex = Math.floor(
          Math.random() * queue.length
        );
      } while (nextIndex === currentIndex);

      set({
        currentIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });

      return;
    }

    if (currentIndex < queue.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    } else if (repeatMode === "all") {
      set({
        currentIndex: 0,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });
    } else {
      set({
        isPlaying: false,
        currentTime: 0,
      });
    }
  },

  // Previous track
  previousTrack: (audioTime = 0) => {
    const {
      queue,
      currentIndex,
      isShuffle,
    } = get();

    if (!queue.length) return;

    if (audioTime > 3) {
      set({ currentTime: 0 });
      return "restart";
    }

    if (isShuffle && queue.length > 1) {
      let previousIndex;

      do {
        previousIndex = Math.floor(
          Math.random() * queue.length
        );
      } while (previousIndex === currentIndex);

      set({
        currentIndex: previousIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      });

      return;
    }

    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : 0;

    set({
      currentIndex: previousIndex,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  // Select a track from queue
  selectQueueTrack: (index) => {
    const { queue } = get();

    if (!queue[index]) return;

    set({
      currentIndex: index,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },
}));

export default useMusicStore;
