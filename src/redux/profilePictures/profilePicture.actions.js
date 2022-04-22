import FacebookManager from "../../Managers/FacebookManager";

export const ADD_PROFILE_PICTURE = "ADD_PROFILE_PICTURE";

/**
 * Redux Action to fetch the profile picture from the Facebook or Callertech APIs
 * and then adds them to store
 * @param {string} phonenumber
 * @param {string} fbId
 */
export const fetchProfilePicture = (phonenumber, fbId) => (dispatch) => {
  console.log("fetchProfilePicture");
  FacebookManager.fetchProfilePicture(fbId).then((url) => {
    if (url) dispatch(addProfilePicture(fbId, url));
  });
};

export const addProfilePicture = ({ id, url }) => ({
  type: ADD_PROFILE_PICTURE,
  payload: { url, id },
});
