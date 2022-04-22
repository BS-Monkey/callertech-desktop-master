import StorageManager from "../../../Managers/StorageManager";

export default function logout() {
  return (dispatch) => {
    StorageManager.saveUserdata({});
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
}
