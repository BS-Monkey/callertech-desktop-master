export default function flags(state = {}, action) {
  if (action.type == "ADD_FLAG") {
    return { ...state, ...action.payload };
  }
  return state;
}
