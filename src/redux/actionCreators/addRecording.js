export default function addRecording(recording) {
  return { type: "ADD_RECORDING", payload: recording };
}
window.addRecording = addRecording;
