import { getPhoneNumber } from "../../utils";

export const CHANGE_CALL_NUM = "CHANGE_CALL_NUM";

export const changeCallNum = (
  phonenumber,
  type = "manual",
  selectedType = "phonenumber"
) => {
  let num = getPhoneNumber(phonenumber);
  if (!num) num = phonenumber;
  return {
    type: CHANGE_CALL_NUM,
    payload: { phonenumber: num, type, selectedType },
  };
};
