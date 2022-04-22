export const TOGGLE_TAB = "TOGGLE_TAB";
const toggleTab = (key, show) => {
  return { type: "TOGGLE_TAB", payload: { key, show } };
};
export default toggleTab;
