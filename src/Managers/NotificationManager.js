const electron = window.electron;
let NotificationManager = {
  checkPermission() {
    if (typeof Notification == "undefined") return false;
    if (Notification.permission === "denied") {
      return false;
    }
    if (Notification.permission === "default") {
      let granted = true;
      Notification.requestPermission().then(permission => {
        if (permission != "granted") {
          granted = false;
        }
      });
      return granted;
    }
    return true;
  },
  send(title, body) {
    if (!this.checkPermission() || document.hasFocus()) return;
    let notification = new Notification(title, {
      icon: "https://callertech.com/logo-sml.png",
      body: body
    });
    if (electron) electron.ipcRenderer.send("show-app", true);
    notification.addEventListener("click", e => {
      window.focus();
      e.target.close();
    });
  }
};

export default NotificationManager;
