import { saveUserdata } from "../../Managers/StorageManager";

export const UPDATE_FB_ACCESS_TOKEN = "FACEBOOK_LOGGED_IN";
export const CHANGE_USERDATA = "CHANGE_USERDATA";

export const updateFBAccessToken = (response) => ({
  type: UPDATE_FB_ACCESS_TOKEN,
  payload: response,
});

export const loggedInToFb = (response) => (dispatch) => {
  dispatch(updateFBAccessToken(response));
  setTimeout(() => saveUserdata(), 200);
};

export const changeUserData = (userdata) => ({
  type: CHANGE_USERDATA,
  payload: userdata,
});
