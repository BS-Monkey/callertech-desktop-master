import APIManager from "../../../Managers/APIManager";
import { enqueueSnackbar } from "../../actionCreators/notify";
import fetchDemographics from "./fetchDemographics";

const updateDemographics = (phonenumber, data) => dispatch => {
  APIManager.updateDemographics({
    ...data,
    phonenumber
  }).then(response => {
    if (response && response.status == "success") {
      dispatch(fetchDemographics(phonenumber));
      dispatch(
        enqueueSnackbar({
          message: "Data has been updated.",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "success"
          }
        })
      );
    }
  });
};
export default updateDemographics;
