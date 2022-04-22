export const ADD_SCHEDULED_CALLS = "ADD_SCHEDULED_CALLS";
const addScheduledCalls = scheduled_calls => ({
  type: ADD_SCHEDULED_CALLS,
  payload: scheduled_calls
});
export default addScheduledCalls;
