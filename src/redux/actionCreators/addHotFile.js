const addHotFile = file => {
  return { type: "ADD_HOTFILE", payload: file };
};
window.addHotFile = addHotFile;
export default addHotFile;
