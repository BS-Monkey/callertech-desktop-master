const defaultState = {};
export default function recordings(state = defaultState, action) {
  if (action.type == "ADD_RECORDING") {
    return action.payload || {};
  }
  return state;
}
