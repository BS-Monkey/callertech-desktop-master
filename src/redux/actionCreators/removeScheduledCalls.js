export const REMOVE_SCHEDULED_CALLS = "ADD_SCHEDULED_CALLS";
const removeScheduledCalls = scheduled_calls => ({
  type: REMOVE_SCHEDULED_CALLS,
  payload: scheduled_calls
});
export default removeScheduledCalls;
