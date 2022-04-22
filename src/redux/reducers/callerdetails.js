import { ADD_CALLERDETAILS } from "../actionCreators/addCallerDetails";
import { CHANGE_CALL_NUM } from "../actionCreators/changeCallNum";
import { RESET_CALLER_DETAILS } from "../actionCreators/resetCallerDetails";

const defaultState = {
  entities: {},
  ids: [],
  loaded: [],
  selected: null,
  type: "manual",
};

export default function callerdetails(state = defaultState, action) {
  switch (action.type) {
    case ADD_CALLERDETAILS: {
      const newState = {
        ...state,
        entities: {
          ...state.entities,
          ...action.payload.data,
        },
        ids: [...state.ids, action.payload.id],
      };
      if (action.payload.loaded)
        newState.loaded = [...state.loaded, action.payload.id];
      return newState;
    }
    case CHANGE_CALL_NUM:
      return {
        ...state,
        selected: action.payload.phonenumber,
        selectedType: action.payload.selectedType,
        type: action.payload.type,
        invalid: /[a-z]/i.test(action.payload.phonenumber),
      };
    case RESET_CALLER_DETAILS:
      return defaultState;
    default:
      return state;
  }
}
