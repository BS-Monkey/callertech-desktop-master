import APIManager from "../../../Managers/APIManager";
import NormalizeCallerData from "../../../normalizers/NormalizeCallerData";
import { addCallerDetails } from "./../addCallerDetails";
import addNotes from "./../addNotes";
import addFlag from "./../addFlag";
import addEmail from "./../addEmail";
import addAddress from "./../addAddress";
import { changeCallNum } from "../changeCallNum";
import { enqueueSnackbar } from "../notify";
const fetchDemographics =
  (phonenumber, fetch, localOnly, type = "phonenumber") =>
  (dispatch) => {
    APIManager.getDemographics(phonenumber, fetch, localOnly, type).then(
      (response) => {
        if (!response || !response.data) {
          dispatch(
            enqueueSnackbar({
              title: "Lookup Failed",
              message: `Could not find any results`,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "error",
              },
            })
          );
          return;
        }
        if (type !== "phonenumber") {
          dispatch(changeCallNum(response.data.phoneNumber, "manual"));
        }
        const callerdata = NormalizeCallerData(response.data);
        console.log("Normalized Data", callerdata);
        setTimeout(() => {
          dispatch(
            addCallerDetails({
              id: phonenumber,
              data: callerdata.callerdetails,
              loaded: fetch,
            })
          );
        }, 100);
        setTimeout(() => {
          dispatch(addNotes(callerdata.notes));
        }, 100);
        setTimeout(() => {
          dispatch(addFlag(callerdata.flags));
        }, 100);
        setTimeout(() => {
          dispatch(addEmail(callerdata.emails));
        }, 100);
        setTimeout(() => {
          dispatch(addAddress(callerdata.address));
        }, 100);
      }
    );
  };

window.fetchDemographics = fetchDemographics;
export default fetchDemographics;
