import { createSelector } from "reselect";

export const audioSelector = (state) => state.app.audio;

export const audioConstraintsSelector = createSelector(
  audioSelector,
  (audio) => {
    return {
      sampleSize: {
        ideal: audio.sample,
      },
      echoCancellation: {
        ideal: audio.echoCancellation,
      },
      autoGainControl: {
        ideal: audio.autoGainControl,
      },
      noiseSuppression: {
        ideal: audio.noiseSuppression,
      },
      volume: audio.volume,
    };
  }
);
