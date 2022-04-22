export default function addFlag(userdata) {
  return { type: "ADD_FLAG", payload: userdata };
}
window._addFlag = addFlag;
