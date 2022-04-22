import APIManager from "../../../Managers/APIManager";
import fetchCampaigns from "./fetchCampaigns";

const toggleDNC = phonenumber => dispatch => {
  APIManager.toggleDNC(phonenumber).then(response => {
    if (response && response.status == "success") {
      dispatch(fetchCampaigns());
    }
  });
};
export default toggleDNC;
