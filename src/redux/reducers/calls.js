import { ADD_CALL } from "../actionCreators/addCall";
import { RESET_CALLS } from "../actionCreators/resetCalls";

const defaultState = {};
export default function calls(state = defaultState, action) {
  if (action.type === ADD_CALL) {
    return { ...state, ...action.payload };
  }
  if (action.type === RESET_CALLS) {
    return defaultState;
  }
  return state;
}
