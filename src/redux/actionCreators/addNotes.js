export default function addNotes(notes) {
  return { type: "ADD_NOTES", payload: notes };
}
window._addNotes = addNotes;
