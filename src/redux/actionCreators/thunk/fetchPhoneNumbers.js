import APIManager from "../../../Managers/APIManager";
import changeSIP from "./../changeSIP";
import changeLoading from "./../changeLoading";
import { fetchConference } from "./fetchConference";

export default function fetchPhoneNumbers() {
  return (dispatch) => {
    dispatch(changeLoading(true));
    APIManager.getSip().then((data) => {
      if (data) {
        dispatch(changeSIP(data));
      }
    });
    dispatch(fetchConference());
  };
}
