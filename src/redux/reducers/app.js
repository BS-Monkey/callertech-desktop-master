import StorageManager from "../../Managers/StorageManager";
import { CHANGE_AUDIO_CONSTRAINTS } from "../actionCreators/changeAudioConstriants";
import { CHANGE_PHONENUMBER } from "../actionCreators/changePhonenumber";
import { SWITCH_MINI } from "../actionCreators/switchMini";

const defaultState = {
  mini: false,
  tab: 1,
  error: false,
  num: 0,
  loading: true,
  callme: "",
  alert: {
    message: "",
    open: false,
  },
  audio: {
    sampleSize: 16,
    echoCancellation: true,
    autoGainControl: false,
    noiseSuppression: false,
    volume: 1,
  },
};

export default function app(state = defaultState, action) {
  if (action.type === CHANGE_AUDIO_CONSTRAINTS) {
    const audio = {
      ...state.audio,
      ...action.payload,
    };
    StorageManager.set("audioConstraints", { audioConstraints: audio });
    return {
      ...state,
      audio,
    };
  }
  if (action.type == "CHANGE_APPERROR") {
    return { ...state, error: action.payload };
  }
  if (action.type == CHANGE_PHONENUMBER) {
    return { ...state, num: action.payload };
  }
  if (action.type == SWITCH_MINI) {
    document.body.style.overflow = action.payload ? "hidden" : "auto";
    return { ...state, mini: action.payload };
  }
  if (action.type == "CHANGE_LOADING") {
    return { ...state, loading: action.payload };
  }
  if (action.type == "SHOW_ALERT") {
    return {
      ...state,
      alert: {
        message: action.payload,
        open: true,
      },
    };
  }
  if (action.type == "HIDE_ALERT") {
    return {
      ...state,
      alert: {
        message: "",
        open: false,
      },
    };
  }

  return state;
}
