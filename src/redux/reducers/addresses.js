const defaultState = {
  ids: [],
  entities: {},
};

export default function addresses(state = defaultState, action) {
  if (action.type == "ADD_ADDRESS" && action.payload) {
    const ids = Object.keys(action.payload);
    return {
      ids: [...state.ids, ...ids],
      entities: {
        ...state.entities,
        ...action.payload,
      },
    };
  }
  return state;
}
