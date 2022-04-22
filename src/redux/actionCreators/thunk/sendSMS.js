import APIManager from "../../../Managers/APIManager";
import audioPlayer from "../../../Managers/audioPlayer";
import { latestSMSSelector } from "../../selectors/conversations";
import store from "../../store";
import { enqueueSnackbar } from "./../notify";
import fetchSMS from "./fetchSMS";

const sendSMS =
  (data, did, phonenumber, sendonly = false) =>
  (dispatch) => {
    APIManager.sendSMS(data).then((sent) => {
      if (sent && !sendonly) {
        const latestSMSId = latestSMSSelector(store.getState());
        dispatch(fetchSMS(did, phonenumber, latestSMSId));
        dispatch(
          enqueueSnackbar({
            message: "Sent",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "success",
            },
          })
        );
        audioPlayer.play("sms_out");
      }
    });
  };
window.sendSMS = sendSMS;
export default sendSMS;
