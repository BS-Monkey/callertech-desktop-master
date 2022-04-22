export const ADD_MESSAGES_LIST = "ADD_MESSAGES_LIST";

const addMessageList = (phonenumber, messages) => {
  return {
    type: ADD_MESSAGES_LIST,
    payload: {
      id: phonenumber,
      data: messages,
    },
  };
};
export default addMessageList;
