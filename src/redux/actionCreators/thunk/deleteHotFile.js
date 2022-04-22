import APIManager from "../../../Managers/APIManager";
import fetchHotFiles from "./fetchHotFiles";

const deleteHotFile = id => dispatch => {
  APIManager.deleteFile(id).then(() => {
    dispatch(fetchHotFiles());
  });
};

export default deleteHotFile;
