const removeHotFile = () => {
  return { type: "REMOVE_HOTFILE", payload: {} };
};
window.removeHotFile = removeHotFile;
export default removeHotFile;
