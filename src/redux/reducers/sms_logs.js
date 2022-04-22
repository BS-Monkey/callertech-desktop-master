import { ADD_SMS_LOGS } from "../actionCreators/addSMSLogs";

const defaultState = {
  current_page: 1,
  last_page: 1,
  total: 0,
  data: []
};
const sms_logs = (state = defaultState, action) => {
  if (action.type == ADD_SMS_LOGS) {
    return action.payload;
  }
  return state;
};
export default sms_logs;
