export const MAKE_CALL = "MAKE_CALL";
export default function makeCall(number) {
  return {
    type: MAKE_CALL,
    payload: number
  };
}
