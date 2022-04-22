import APIManager from "../../../Managers/APIManager";
import { enqueueSnackbar } from "../../actionCreators/notify";
import fetchSMS from "./fetchSMS";

const sendHotFile = (from, to, message) => dispatch => {
  //   dispatch(changeLoading(true));
  APIManager.sendSms(from, to, message).then(response => {
    // dispatch(changeLoading(false));
    if (response && response.status == "success") {
      dispatch(
        enqueueSnackbar({
          message: "Message has been sent successfully.",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "success"
          }
        })
      );
      dispatch(fetchSMS(from, to));
    } else {
      dispatch(
        enqueueSnackbar({
          message: "There was an error sending the file. Please try again.",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "warning"
          }
        })
      );
    }
  });
};

export default sendHotFile;
