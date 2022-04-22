import APIManager from "../../../Managers/APIManager";
import StorageManager from "../../../Managers/StorageManager";
import { enqueueSnackbar } from "../notify";
import switchDemographics from "../switchDemographics";

const toggleDemographics = (option) => async (dispatch) => {
  try {
    const saved = await APIManager.saveSettings({
      enable_auto_lookups: option,
    });
    if (!saved) {
      throw new Error("Could not save lookup settings!");
    }
    dispatch(switchDemographics(option));
    dispatch(
      enqueueSnackbar({
        message: "Saved Lookup Settings!",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "success",
        },
      })
    );
  } catch (e) {
    dispatch(
      enqueueSnackbar({
        message:
          "There was an error in saving your settings! Please try again.",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
        },
      })
    );
  }
};

export default toggleDemographics;
