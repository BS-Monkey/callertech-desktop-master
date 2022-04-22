import APIManager from "../../../Managers/APIManager";
import { enqueueSnackbar } from "./../notify";
import sendSMS from "./sendSMS";

const sendMMS = (file, did, phonenumber) => (dispatch) => {
  dispatch(
    enqueueSnackbar({
      message: "Uploading",
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "success",
      },
    })
  );
  APIManager.uploadMMS(file).then((filename) => {
    console.log(filename);
    const filetype = file.type;
    if (filename && filetype)
      dispatch(
        sendSMS(
          {
            filename,
            filetype,
            from: did,
            to: phonenumber,
          },
          did,
          phonenumber
        )
      );
  });
};
window.sendMMS = sendMMS;
export default sendMMS;
