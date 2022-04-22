import APIManager from "../../../Managers/APIManager";
import fetchDemographics from "./fetchDemographics";

export const SET_CNAME = "SET_CNAME";

export const setCNAME = (phonenumber, name) => (dispatch) => {
  APIManager.setCNAME(phonenumber, name).then(() => {
    dispatch(fetchDemographics(phonenumber, false, true));
  });
};
