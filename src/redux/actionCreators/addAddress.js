export default function addAddress(address) {
  return { type: "ADD_ADDRESS", payload: address };
}
window.addAddress = addAddress;
