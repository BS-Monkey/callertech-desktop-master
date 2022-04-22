export default function changeAppError(error) {
  return { type: "CHANGE_APPERROR", payload: error };
}
