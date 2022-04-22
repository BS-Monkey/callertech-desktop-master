import { ADD_VOICEMAIL } from "../actionCreators/addVoicemail";
import { MAKE_VOICEMAIL_READ } from "../actionCreators/makeVoicemailRead";
const defaultState = {
  entities: {},
  ids: [],
  loaded: false,
};

const voicemail = (state = defaultState, action) => {
  if (action.type == ADD_VOICEMAIL) {
    return {
      entities: action.payload.entities,
      ids: action.payload.ids,
      loaded: true,
    };
  }
  if (action.type == MAKE_VOICEMAIL_READ) {
    let newState = {
      ...state,
    };
    if (newState.entities[action.payload]) {
      newState.entities[action.payload].is_read = true;
    }
    return newState;
  }
  return state;
};

export default voicemail;
