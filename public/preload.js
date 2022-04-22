window.electron = require("electron") || { shell: null };
window.isDev = require("electron-is-dev");
window.ejstorage = require("electron-json-storage");
window.main = window.electron.remote.require("./electron.js");
window.CustomTitleBar = require("custom-electron-titlebar");
