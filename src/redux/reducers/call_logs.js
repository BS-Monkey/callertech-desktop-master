import { ADD_CALL_LOGS } from "../actionCreators/addCallLogs";

const defaultState = {
  current_page: 1,
  last_page: 1,
  total: 0,
  data: []
};
const call_logs = (state = defaultState, action) => {
  if (action.type == ADD_CALL_LOGS) {
    return action.payload;
  }
  return state;
};
export default call_logs;
