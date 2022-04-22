import APIManager from "../../../Managers/APIManager";
import removeVoicemail from "./../removeVoicemail";
import NormalizeVoicemail from "../../../normalizers/NormalizeVoicemail";
import addVoicemail from "./../addVoicemail";

const fetchVoicemail = () => (dispatch) => {
  dispatch(removeVoicemail());
  APIManager.fetchVoicemail().then((voicemail) => {
    if (voicemail.status == "success") {
      dispatch(addVoicemail(NormalizeVoicemail(voicemail.data)));
    }
  });
};
window.fetchVoicemail = fetchVoicemail;
export default fetchVoicemail;
