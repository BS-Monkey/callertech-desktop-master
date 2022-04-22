import APIManager from "../../../Managers/APIManager";
import addCallLogs from "./../addCallLogs";

const fetchCallLogs = (phonenumber, page) => (dispatch) => {
  APIManager.callLogs(phonenumber, page).then((response) => {
    if (!response) return;
    dispatch(addCallLogs(response));
  });
};
export default fetchCallLogs;
