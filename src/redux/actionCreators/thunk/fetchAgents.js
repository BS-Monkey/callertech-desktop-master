import APIManager from "../../../Managers/APIManager";
import { normalizeAgents } from "../../../normalizers/NormalizeAgents";
import { loadAgents } from "../loadAgents";

export const FETCH_AGENTS = "FETCH_AGENTS";

export const fetchAgents = () => (dispatch) => {
  APIManager.fetchAgents().then(({ data }) => {
    console.log("agents", data);
    dispatch(loadAgents(normalizeAgents(data)));
  });
};
