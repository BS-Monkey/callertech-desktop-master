const addRecentCalls = (phonenumber, calls) => {
  return {
    type: "ADD_RECENT_CALLS",
    payload: {
      [phonenumber]: calls
    }
  };
};
export default addRecentCalls;
