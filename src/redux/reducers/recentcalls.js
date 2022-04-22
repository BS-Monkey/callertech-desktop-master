import { RESET_RECENT_CALLS } from "../actionCreators/resetRecentCalls";

const defaultState = {};
export default function recentcalls(state = defaultState, action) {
  if (action.type == "ADD_RECENT_CALLS") {
    return { ...state, ...action.payload };
  }
  if (action.type == "REMOVE_RECENT_CALLS") {
    return {};
  }
  if (action.type === RESET_RECENT_CALLS) {
    return defaultState;
  }
  return state;
}
