export const ADD_CONFERENCE = "ADD_CONFERENCE";

export const addConference = (data) => {
  return {
    payload: data,
    type: ADD_CONFERENCE,
  };
};
