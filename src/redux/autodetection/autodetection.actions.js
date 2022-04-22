export const ADD_AUTODETECTION = "ADD_AUTODETECTION";
export const REMOVE_AUTODETECTION = "REMOVE_AUTODETECTION";

export const addAutodetection = (payload) => {
  return { type: ADD_AUTODETECTION, payload };
};
window.addAutodetection = addAutodetection;

export const removeAutodetection = () => {
  return { type: REMOVE_AUTODETECTION, payload: {} };
};
window.removeAutodetection = removeAutodetection;
