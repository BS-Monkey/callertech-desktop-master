import APIManager from "../../Managers/APIManager";
import { addAutodetection, removeAutodetection } from "./autodetection.actions";

export const deleteAutodetection = (id) => (dispatch) => {
  APIManager.deleteAutodetection(id).then(() => {
    dispatch(fetchAutodetections());
  });
};

export const fetchAutodetections = () => (dispatch) => {
  APIManager.getAutodetection().then((data) => {
    dispatch(removeAutodetection());

    if (data && data.status == "success" && data.count) {
      const entities = data.data.reduce(
        (entities, row) => ({ ...entities, [row.id]: row }),
        {}
      );
      const ids = Object.keys(entities);
      dispatch(addAutodetection({ entities, ids }));
    }
  });
};
