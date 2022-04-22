export default function notes(state = {}, action) {
  if (action.type == "ADD_NOTES") {
    return { ...state, ...action.payload };
  }
  return state;
}
