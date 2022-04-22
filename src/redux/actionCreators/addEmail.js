export default function addEmail(email) {
  return { type: "ADD_EMAIL", payload: email };
}
window._addEmail = addEmail;
