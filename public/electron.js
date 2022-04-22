const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const process = require("process");
const { autoUpdater } = require("electron-updater");

const isDev = require("electron-is-dev");
const path = require("path");
const contextMenu = require("electron-context-menu");
const config = require("./config");
const server = require("./server");

let tray = null;
let win;
let loaded = false;
var appIcon = path.join(__dirname, "assets/app.png");
var trayIcon = path.join(__dirname, "assets/icons/tray.png");
app.setAppUserModelId("com.callertech.webphone");
app.commandLine.appendSwitch("ignore-certificate-errors", "true");
const date = new Date();
const timestamp = date.getTime();
let lastData = null;
const handleLookupMessage = (data) => {
  if (
    !data ||
    (lastData &&
      lastData.type === data.type &&
      lastData.payload === data.payload)
  ) {
    return;
  }
  lastData = data;
  console.log("handleLookupMessage", data);
  win.webContents.send("lookup", data);
  setTimeout(() => {
    win.focus();
  }, 500);
};

server.init(handleLookupMessage);

ipcMain.on("webapp_loaded", () => {
  if (isDev) {
    const {
      REDUX_DEVTOOLS,
      default: installExtension,
    } = require("electron-devtools-installer");
    installExtension(["fmkadmapgofadopljbjfkapdkoienihi", REDUX_DEVTOOLS]).then(
      () => {}
    );
  }
});

let width, height, isMac;
function createWindow() {
  if (app.dock) app.dock.hide();
  const { screen } = require("electron");
  ({ width, height } = screen.getPrimaryDisplay().workAreaSize);
  width = parseInt(width * 0.9);
  height = parseInt(height * 0.9);
  console.log({ width, height });
  // console.log(screen.getPrimaryDisplay().workAreaSize);
  win = new BrowserWindow({
    width: width,
    height: height,
    icon: appIcon,
    show: false,
    center: true,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
    },
  });

  win.loadURL(config.web_url);

  // win.setMenuBarVisibility(false);

  isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [{ role: "quit" }],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          click: function () {
            win.webContents.send("openSettings");
          },
        },
        {
          label: "Refresh",
          click: function () {
            win.webContents.send("refresh");
          },
          accelerator: "CommandOrControl+R",
        },
        {
          label: "Logout",
          click: function () {
            win.webContents.send("logout");
          },
        },
        {
          label: "Restart App",
          click: function () {
            app.relaunch();
            app.isQuiting = true;
            app.quit();
          },
        },
        {
          label: "Quit",
          click: function () {
            app.isQuiting = true;
            app.quit();
          },
          accelerator: "CommandOrControl+Q",
        },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Widget",
          accelerator: "CommandOrControl+m",
          click: toggleMini,
        },
        {
          label: "Hide",
          role: "quit",
        },
        { type: "separator" },
        { role: "togglefullscreen" },
        { type: "separator" },
        { role: "resetzoom", label: "Reset Zoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "toggledevtools" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  autoUpdater.checkForUpdatesAndNotify();
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60 * 60);
  //wait until webpack build html page
  win.webContents.on("did-frame-finish-load", () => {
    loaded = true;
    win.show();
    win.focus();
    if (app.dock) app.dock.show();
  });

  // Emitted when the window is closed.
  win.on("closed", function () {
    console.log("closed");
    if (process.platform !== "darwin") {
      app.quit();
    }
    // win.hide();
  });

  win.on("close", function (event) {
    console.log("close");
    // if (process.platform == "darwin")
    //   return true;
    console.log("still runing :(");
    if (app.dock) app.dock.hide();
    if (!loaded) return true;
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
      if (process.platform != "darwin")
        tray.displayBalloon({
          icon: appIcon,
          title: "Callertech is still running",
          content:
            "You can receive calls in the background. Click here to re-open the app.",
        });
    }
    return false;
  });
  tray = new Tray(trayIcon);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "Version " + app.getVersion(),
      click: function () {},
    },
    {
      label: "Show App",
      click: function () {
        win.show();
        win.focus();
        if (app.dock) app.dock.show();
      },
    },
    {
      label: "Check for updates...",
      click: function () {
        autoUpdater.checkForUpdatesAndNotify();
        win.webContents.send("check_for_updates");
      },
    },
    {
      label: "Quit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
      accelerator: "CommandOrControl+Q",
    },
  ]);
  tray.on("click", () => {
    win.show();
    win.focus();
  });
  tray.setToolTip("Callertech Desktop Phone");
  win.frame = false;
  tray.setContextMenu(contextMenu);
}
contextMenu({
  showInspectElement: false,
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("ready", createWindow);
}
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  } else {
    win.show();
  }
});

ipcMain.on("get-result", (event, arg) => {
  event.returnValue = `electron-${arg.name}`;
});

ipcMain.on("show-app", () => {
  win.show();
  if (app.dock) app.dock.show();
  console.log("show app");
});

const makeMini = () => {
  win.webContents.send("switchToWidget");
  console.log("make_mini");
  if (isMac) win.setWindowButtonVisibility(false);
  win.setMaximizable(false);
  win.setFullScreenable(false);
  win.setBounds(
    {
      x: parseInt(width * 0.8),
      y: parseInt(height * 0.5),
      width: 170,
      height: 262,
    },
    true
  );
  win.setResizable(false);
  // win.setAlwaysOnTop(true);
};
const makeFull = () => {
  console.log("make_full");
  // win.hide();
  win.webContents.send("switchToFull");
  if (isMac) win.setWindowButtonVisibility(true);

  win.setMaximizable(true);
  win.setFullScreenable(true);
  win.setResizable(true);
  // win.setAlwaysOnTop(false);
  win.setSize(width, height, true);
  win.center();
  // win.show();
};
let mini = 0;
const toggleMini = () => {
  if (mini) {
    mini = 0;
    makeFull();
  } else {
    mini = 1;
    makeMini();
  }
};

ipcMain.on("make_mini", makeMini);
ipcMain.on("make_full", makeFull);

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  app.relaunch();
  app.isQuiting = true;
  app.quit();
});

ipcMain.on("update_app", () => {
  app.isQuiting = true;
  autoUpdater.quitAndInstall();
});

// Code to create fb authentication window
ipcMain.on("fb-authenticate", function (event, arg) {
  var options = {
    client_id: Env.fb_client_id,
    scopes: "email",
    redirect_uri: "https://www.facebook.com/connect/login_success.html",
  };

  var authWindow = new BrowserWindow({
    width: 450,
    height: 300,
    show: false,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  var facebookAuthURL = `https://www.facebook.com/v3.2/dialog/oauth?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&response_type=token,granted_scopes&scope=${options.scopes}&display=popup`;

  authWindow.loadURL(facebookAuthURL);
  authWindow.webContents.on("did-finish-load", function () {
    authWindow.show();
  });

  var access_token, error;
  var closedByUser = true;

  var handleUrl = function (url) {
    var raw_code = /access_token=([^&]*)/.exec(url) || null;
    access_token = raw_code && raw_code.length > 1 ? raw_code[1] : null;
    error = /\?error=(.+)$/.exec(url);

    if (access_token || error) {
      closedByUser = false;
      FB.setAccessToken(access_token);
      FB.api(
        "/me",
        {
          fields: ["id", "name", "picture.width(800).height(800)"],
        },
        function (res) {
          mainWindow.webContents.executeJavaScript(
            'document.getElementById("fb-name").innerHTML = " Name: ' +
              res.name +
              '"'
          );
          mainWindow.webContents.executeJavaScript(
            'document.getElementById("fb-id").innerHTML = " ID: ' + res.id + '"'
          );
          mainWindow.webContents.executeJavaScript(
            'document.getElementById("fb-pp").src = "' +
              res.picture.data.url +
              '"'
          );
        }
      );
      authWindow.close();
    }
  };

  authWindow.webContents.on("will-navigate", (event, url) => handleUrl(url));
  var filter = {
    urls: [options.redirect_uri + "*"],
  };
  session.defaultSession.webRequest.onCompleted(filter, (details) => {
    var url = details.url;
    handleUrl(url);
  });

  authWindow.on(
    "close",
    () =>
      (event.returnValue = closedByUser
        ? { error: "The popup window was closed" }
        : { access_token, error })
  );
});
