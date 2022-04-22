import APIManager from "../../../Managers/APIManager";
import { makeMessageGroupRead } from "../makeMessageGroupRead";
import fetchSMS from "./fetchSMS";

export const READ_SMS = "READ_SMS";
export const readSMS = (did, phonenumber) => (dispatch) => {
  dispatch(makeMessageGroupRead(phonenumber));
  APIManager.readSMS(phonenumber).then(() => {
    dispatch(fetchSMS(did, phonenumber));
  });
};
