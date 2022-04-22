export const ADD_CALLERDETAILS = "ADD_CALLERDETAILS";

export const addCallerDetails = (data) => {
  return { type: ADD_CALLERDETAILS, payload: data };
};
