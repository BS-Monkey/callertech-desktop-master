export default function email(state = {}, action) {
  if (action.type == "ADD_EMAIL") {
    return { ...state, ...action.payload };
  }
  return state;
}
