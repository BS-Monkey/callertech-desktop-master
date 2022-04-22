import Logger from "./Logger";

import FILES from "../sounds.js";
import DMTF_SOUNDS from "../dmtf";

const logger = new Logger("audioPlayer");

export const SOUNDS = new Map([
  ["ringback", { audio: FILES["ringback"], volume: 1.0 }],
  ["ringing", { audio: "./assets/audio/ringtone.wav", volume: 1.0 }],
  ["answered", { audio: FILES["answered"], volume: 1.0 }],
  ["rejected", { audio: FILES["rejected"], volume: 0.5 }],
  ["sms_in", { audio: "./assets/audio/sms_in.mp3", volume: 0.5 }],
  ["sms_out", { audio: "./assets/audio/sms_out.mp3", volume: 0.5 }],
  ["waiting", { audio: "./assets/audio/waiting.wav", volume: 0.5 }],
]);

const DMTF = Object.keys(DMTF_SOUNDS).map((char) => ({
  name: char,
  audio: `data:audio/wav;base64,${DMTF_SOUNDS[char]}`,
}));

let initialized = false;
const audio = new Audio();
export default {
  /**
   * Play all the sounds so they will play in mobile browsers at any time
   */
  initialize() {
    if (initialized) return;

    logger.debug("initialize()");
    audio.muted = false;
    audio.src = SOUNDS.get("answered").audio;
    audio.volume = 0.01;
    audio.loop = false;
    audio.play().then(() => {
      audio.pause();
      audio.volume = 0.15;
    });
    initialized = true;
  },

  playDMTF(char) {
    console.log({ char });
    var df = document.createDocumentFragment();
    var item = DMTF.find((item) => item.name == char);
    console.log("playing", item, audio);
    if (item) {
      audio.muted = false;
      audio.src = item.audio;
      audio.loop = false;
      audio.playbackRate = 4;
      audio.volume = 0.25;
      audio.play();
    }
  },
  /**
   * Play a sound
   * @param {String} name - Sound name
   * @param {[Float]} relativeVolume - Relative volume (0.0 - 1.0)
   */
  play(name, relativeVolume) {
    if (typeof relativeVolume !== "number") relativeVolume = 1.0;

    logger.debug("play() [name:%s, relativeVolume:%s]", name, relativeVolume);

    const sound = SOUNDS.get(name);

    if (!sound) throw new Error(`unknown sound name "${name}"`);

    try {
      audio.src = sound.audio;
      audio.pause();
      audio.currentTime = 0.0;
      audio.loop = false;
      audio.volume = (sound.volume || 1.0) * relativeVolume;
      audio.play();
    } catch (error) {
      logger.warn("play() | error: %o", error);
    }
  },
  /**
   * Play a looped sound
   * @param {String} name - Sound name
   * @param {[Float]} relativeVolume - Relative volume (0.0 - 1.0)
   */
  playLooped(name, relativeVolume) {
    if (typeof relativeVolume !== "number") relativeVolume = 1.0;

    logger.debug("play() [name:%s, relativeVolume:%s]", name, relativeVolume);

    const sound = SOUNDS.get(name);

    if (!sound) throw new Error(`unknown sound name "${name}"`);

    try {
      audio.pause();
      audio.src = sound.audio;
      audio.currentTime = 0.0;
      audio.volume = (sound.volume || 1.0) * relativeVolume;
      audio.loop = true;
      audio.play();
    } catch (error) {
      logger.warn("play() | error: %o", error);
    }
  },

  stop(name) {
    audio.pause();
    audio.currentTime = 0.0;
  },
};
