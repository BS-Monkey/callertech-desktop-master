import APIManager from "../../../Managers/APIManager";
import addContact from "../addContact";

const fetchContactsList = (page) => (dispatch) => {
  APIManager.contacts_list(page).then((response) => {
    if (!response) return;
    dispatch(addContact(response));
  });
};
export default fetchContactsList;
