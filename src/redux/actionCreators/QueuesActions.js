export const ADD_QUEUES = "ADD_QUEUES";
export const TOGGLE_QUEUE = "TOGGLE_QUEUE";
export const CLEAR_QUEUE = "CLEAR_QUEUE";

export const addQueues = (queues) => {
  return {
    type: ADD_QUEUES,
    payload: queues,
  };
};
export const clearQueues = () => {
  return {
    type: CLEAR_QUEUE,
  };
};
export const toggleQueue = (queue) => {
  return {
    type: TOGGLE_QUEUE,
    payload: queue,
  };
};
