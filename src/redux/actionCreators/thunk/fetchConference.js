import APIManager from "../../../Managers/APIManager";
import { addConference } from "../addConference";

export const fetchConference = () => (dispatch) => {
  APIManager.fetchConference().then((data) => {
    dispatch(addConference(data));
  });
};
