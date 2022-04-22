import {
  ADD_QUEUES,
  TOGGLE_QUEUE,
  CLEAR_QUEUE,
} from "../actionCreators/QueuesActions";

const defaultState = {
  loaded: false,
  data: [],
};

const queues = (state = defaultState, action) => {
  if (action.type == ADD_QUEUES) {
    return {
      loaded: true,
      data: action.payload,
    };
  }
  if (action.type == TOGGLE_QUEUE) {
    let queue_id = state.findIndex((q) => q.id == action.queue.id);
    let newState = state;
    if (newState[queue_id]) {
      newState[queue_id].joined = !newState[queue_id].joined;
    }
    return newState;
  }
  if (action.type == CLEAR_QUEUE) {
    return defaultState;
  }
  return state;
};

export default queues;
