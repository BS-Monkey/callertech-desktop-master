export const UPDATE_LATEST_MESSAGE_ID = "UPDATE_LATEST_MESSAGE_ID";

export const updateLatestMessageId = (id) => {
  return {
    type: UPDATE_LATEST_MESSAGE_ID,
    payload: id,
  };
};
