import { LOGIN_WITH_OFFICE } from "../actionCreators/loginWithOffice";
import { CHANGE_USERDATA, UPDATE_FB_ACCESS_TOKEN } from "./settings.actions";

const DEFAULT_STATE = {
  accessToken: null,
};

export const SettingsReducer = (state = DEFAULT_STATE, action) => {
  if (action.type === UPDATE_FB_ACCESS_TOKEN) {
    return {
      ...state,
      accessToken: action.payload,
    };
  }
  if (action.type == CHANGE_USERDATA) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type == LOGIN_WITH_OFFICE) {
    return { ...state, office: true };
  }
  return state;
};
