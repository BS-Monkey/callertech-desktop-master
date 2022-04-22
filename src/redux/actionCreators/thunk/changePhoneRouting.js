import APIManager from "../../../Managers/APIManager";
import changeLoading from "./../changeLoading";
import showAlert from "./../showAlert";
import fetchPhoneNumbers from "./fetchPhoneNumbers";

export default function changePhoneRouting({
  num,
  phonenumber,
  forwarding_number
}) {
  return dispatch => {
    dispatch(changeLoading(true));
    APIManager.togglePhoneRouting({
      forwarding_number,
      phonenumber
    }).then(response => {
      if (response && response.status == "success") {
        dispatch(fetchPhoneNumbers());
      } else {
        showAlert(`There was an error. Please try again.`);
      }
      dispatch(changeLoading(false));
    });
  };
}
