const defaultState = {
  phonenumber: null,
  type: "manual"
};
export default function calldata(state = defaultState, action) {
  if (action.type == "CHANGE_CALLNUM") {
    return {
      ...state,
      phonenumber: action.payload.phonenumber,
      type: action.payload.type || "manual"
    };
  }
  return state;
}
