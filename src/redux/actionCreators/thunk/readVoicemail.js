import APIManager from "../../../Managers/APIManager";
import makeVoicemailRead from "../makeVoicemailRead";

export const readVoicemail = (id) => (dispatch) => {
  APIManager.readVoicemail(id).then(() => {
    dispatch(makeVoicemailRead(id));
  });
};
