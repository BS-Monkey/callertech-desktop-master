import { LOAD_AGENTS } from "../actionCreators/loadAgents";

const defaultState = {
  loaded: false,
  entities: {},
  ids: [],
};

export const agents = (state = defaultState, action) => {
  if (action.type === LOAD_AGENTS) {
    return {
      ...state,
      loaded: true,
      entities: action.payload.entities,
      ids: action.payload.ids,
    };
  }
  return state;
};
