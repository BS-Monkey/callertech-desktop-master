import { ADD_CONFERENCE } from "../actionCreators/addConference";

const defaultState = {
  fetched: false,
  data: {},
};
export default function conference(state = defaultState, action) {
  if (action.type === ADD_CONFERENCE) {
    return {
      ...defaultState,
      fetched: true,
      data: action.payload,
    };
  }
  return state;
}
