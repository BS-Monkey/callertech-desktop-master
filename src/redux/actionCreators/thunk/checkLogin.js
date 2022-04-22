import APIManager from "../../../Managers/APIManager";
import changeLoading from "./../changeLoading";
import showAlert from "./../showAlert";
import { saveUserdata } from "../../../Managers/StorageManager";
import { changeUserData } from "../../settings/settings.actions";

export default function checkLogin(username, password) {
  return (dispatch) => {
    dispatch(changeLoading(true));
    APIManager.login(username, password).then(({ error, userdata }) => {
      if (error) {
        dispatch(showAlert(error));
      } else {
        dispatch(changeUserData(userdata));
        saveUserdata();
      }
      dispatch(changeLoading(false));
    });
  };
}
