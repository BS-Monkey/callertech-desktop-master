import { getPhoneNumber } from "../../../utils";
import APIManager from "../../../Managers/APIManager";
import fetchPhoneNumbers from "./fetchPhoneNumbers";
import changeLoading from "./../changeLoading";

const changeVoicemail = (phonenumber, option) => (dispatch) => {
  phonenumber = getPhoneNumber(phonenumber);
  if (!phonenumber) return;
  dispatch(changeLoading(true));
  APIManager.toggleVoicemail(phonenumber, option).then(() => {
    dispatch(fetchPhoneNumbers());
  });
};

export default changeVoicemail;
