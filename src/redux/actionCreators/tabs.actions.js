export const TOGGLE_TAB = "TOGGLE_TAB";
export const toggleTab = (key, show) => {
  return { type: "TOGGLE_TAB", payload: { key, show } };
};

export const CHANGE_TAB = "CHANGE_TAB";
export const changeTab = (value) => ({ type: CHANGE_TAB, payload: value });
