import {
  ADD_AUTODETECTION,
  REMOVE_AUTODETECTION,
} from "./autodetection.actions";

const defaultState = {
  entities: {},
  ids: [],
  loaded: false,
};

export const autodetectionReducer = (state = defaultState, action) => {
  if (action.type == ADD_AUTODETECTION) {
    return {
      ...state,
      loaded: true,
      ids: action.payload.ids,
      entities: action.payload.entities,
    };
  }
  if (action.type == REMOVE_AUTODETECTION) {
    return defaultState;
  }
  return state;
};
