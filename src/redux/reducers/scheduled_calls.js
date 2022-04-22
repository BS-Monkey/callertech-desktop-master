import { ADD_SCHEDULED_CALLS } from "../actionCreators/addScheduledCalls";
import { REMOVE_SCHEDULED_CALLS } from "../actionCreators/removeScheduledCalls";

const defaultState = [];
const scheduled_calls = (state = defaultState, action) => {
  if (action.type == ADD_SCHEDULED_CALLS) {
    return action.payload || defaultState;
  }
  if (action.type == REMOVE_SCHEDULED_CALLS) {
    return defaultState;
  }
  return state;
};

export default scheduled_calls;
