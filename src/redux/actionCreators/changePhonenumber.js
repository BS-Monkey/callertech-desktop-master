export const CHANGE_PHONENUMBER = "CHANGE_PHONENUMBER";
export default function changePhonenumber(phonenumber) {
  return { type: CHANGE_PHONENUMBER, payload: phonenumber };
}
