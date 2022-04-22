import APIManager from "../../../Managers/APIManager";
import { enqueueSnackbar } from "./../notify";
import sendSMS from "./sendSMS";

export const sendGroupMMS = (file, did, phonenumbers) => (dispatch) => {
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
    if (filename && filetype) {
      phonenumbers.forEach((phonenumber, index) =>
        dispatch(
          sendSMS(
            {
              filename,
              filetype,
              from: did,
              to: phonenumber,
            },
            did,
            phonenumber,
            index !== phonenumbers.length - 1
          )
        )
      );
    }
  });
};
