export const MAKE_MESSAGE_GROUP_READ = "MAKE_MESSAGE_GROUP_READ";

export const makeMessageGroupRead = (phonenumber) => ({
  type: MAKE_MESSAGE_GROUP_READ,
  payload: phonenumber,
});
