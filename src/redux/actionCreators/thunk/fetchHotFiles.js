import APIManager from "../../../Managers/APIManager";
import addHotFile from "./../addHotFile";
import removeHotFile from "./../removeHotFile";

const fetchHotFiles = () => dispatch => {
  APIManager.getHotFiles().then(data => {
    dispatch(removeHotFile());
    if (data && data.status == "success" && data.count) {
      data.data.forEach(file => {
        dispatch(addHotFile(file));
      });
    }
  });
};
export default fetchHotFiles;
