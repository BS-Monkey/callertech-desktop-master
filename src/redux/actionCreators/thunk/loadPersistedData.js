import StorageManager from "../../../Managers/StorageManager";
import changeLoading from "./../changeLoading";
import { changeAudioConstraints } from "../changeAudioConstriants";
import { changeUserData } from "../../settings/settings.actions";
// import callerdata from "../callerdata.json";
// import NormalizeCallerData from "../normalizers/NormalizeCallerData";
// import addCallerDetails from "./addCallerDetails";
// import addNotes from "./addNotes";
// import addFlag from "./addFlag";
// import addEmail from "./addEmail";

const loadPersistedData = () => {
  return (dispatch) => {
    StorageManager.get("userdata")
      .then((userdata) => {
        console.log(userdata);
        if (userdata) {
          if (userdata.token) {
            dispatch(changeUserData(userdata));
          }
        }
        dispatch(changeLoading(false));
      })
      .catch(() => {
        dispatch(changeLoading(false));
      });
    StorageManager.get("audioConstraints").then((obj) => {
      if (obj && Object.keys(obj).includes("audioConstraints")) {
        dispatch(changeAudioConstraints(obj.audioConstraints));
      }
    });
  };
};

export default loadPersistedData;
