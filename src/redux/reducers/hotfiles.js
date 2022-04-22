const defaultState = [];
const hotfiles = (state = defaultState, action) => {
  if (action.type == "ADD_HOTFILE") {
    return [...state, action.payload];
  }
  if (action.type == "REMOVE_HOTFILE") {
    return defaultState;
  }
  return state;
};
export default hotfiles;
