import React, { useCallback, useEffect, useState } from "react";
import Router from "./Router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Snackbar, Button } from "@material-ui/core";
import Loader from "./components/Loader";
import Error from "./components/Error";
import { useSelector, useDispatch } from "react-redux";
import { SnackbarProvider } from "notistack";
import loadPersistedData from "./redux/actionCreators/thunk/loadPersistedData";
import hideAlert from "./redux/actionCreators/hideAlert";
import Alert from "./components/Alert";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import APIManager from "./Managers/APIManager";
import AppErrorBoundry from "./ErrorBoundries/AppErrorBoundry";
import logout from "./redux/actionCreators/thunk/logout";
import toggleTab from "./redux/actionCreators/toggleTab";
import switchMini from "./redux/actionCreators/switchMini";
import audioPlayer, { SOUNDS } from "./Managers/audioPlayer";
import { enqueueSnackbar } from "./redux/actionCreators/notify";
import { getPhoneNumber } from "./utils";
import { changeCallNum } from "./redux/actionCreators/changeCallNum";
import fetchDemographics from "./redux/actionCreators/thunk/fetchDemographics";

const electron = window.electron;
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f37524",
      contrastText: "#fff",
    },
    secondary: { main: "#52AD17" },
  },
  status: {
    danger: "orange",
  },
});
let inactivityTime = () => {
  var time;
  window.addEventListener("load", resetTimer, true);
  var events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
  events.forEach(function (name) {
    document.addEventListener(name, resetTimer, true);
  });
  function reload() {
    window.location.reload(1);
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(reload, 1000 * 60 * 10);
  }
};
const App = () => {
  const error = useSelector((state) => state.app.error);
  const alert = useSelector((state) => state.app.alert);
  const mini = useSelector((state) => state.app.mini);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [unmuted, setUnmuted] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [titlebar, setTitlebar] = useState(false);
  window.setRefreshRequired = setRefreshRequired;
  const dispatch = useDispatch();
  dispatch(loadPersistedData());
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleSwitchToWidget = () => {
    if (window.electron) {
      dispatch(switchMini(1));
    }
  };
  const handleSwitchToFull = () => {
    if (window.electron) {
      dispatch(switchMini(0));
    }
  };
  const handleOpenSettingsTab = () => {
    dispatch(toggleTab("settings", true));
  };
  const handleLookupMessage = (event, data) => {
    console.log("Lookup Message:", data);
    if (!data || !data.type || !data.payload) {
      return;
    }

    dispatch(
      enqueueSnackbar({
        title: "Looking up",
        message: `${data.type}: ${data.payload}`,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "success",
        },
      })
    );

    if (data.type === "phonenumber") {
      dispatch(changeCallNum(getPhoneNumber(data.payload), "manual"));
    } else {
      dispatch(fetchDemographics(data.payload, 1, false, data.type));
    }
  };

  useEffect(() => {
    if (window.CustomTitleBar) {
      if (mini && titlebar) {
        titlebar.dispose();
        setTitlebar(null);
      }
      if (!titlebar && !mini) {
        setTitlebar(
          new window.CustomTitleBar.Titlebar({
            backgroundColor: window.CustomTitleBar.Color.fromHex("#f5f5f5"),
            icon: "./assets/app.png",
          })
        );
      }
    }
  }, [mini]);

  useEffect(() => {
    // CA5F1D
    // window.addEventListener("message", function (ev) {
    //   if (ev.data && ev.data.type === "lookupMessage") {
    //     console.log("onMessage", ev.data.payload);
    //   }
    // });
    if (electron) {
      console.log("attaching electron handlers");
      electron.ipcRenderer.send("webapp_loaded");
      electron.ipcRenderer.on("lookup", handleLookupMessage);
      electron.ipcRenderer.on("openSettings", handleOpenSettingsTab);
      electron.ipcRenderer.on("logout", handleLogout);
      electron.ipcRenderer.on("switchToWidget", handleSwitchToWidget);
      electron.ipcRenderer.on("switchToFull", handleSwitchToFull);
      electron.ipcRenderer.on("update_downloaded", () => {
        setUpdateDownloaded(true);
      });
      electron.ipcRenderer.on("update_available", () => {
        setUpdateAvailable(true);
      });
      electron.ipcRenderer.on("check_for_updates", () => {
        APIManager.getVersion().then((version) => {
          if (version > window.__version) {
            setRefreshRequired(true);
          }
        });
      });
      electron.ipcRenderer.on("refresh", () => {
        document.location.reload(true);
      });
    }
    const versionInterval = setInterval(() => {
      APIManager.getVersion().then((version) => {
        if (version > window.__version) {
          setRefreshRequired(true);
        }
      });
    }, 1000 * 60);

    return () => {
      clearInterval(versionInterval);
      if (electron) {
        electron.ipcRenderer.removeAllListeners("lookup");
        electron.ipcRenderer.removeAllListeners("openSettings");
        electron.ipcRenderer.removeAllListeners("logout");
        electron.ipcRenderer.removeAllListeners("switchToWidget");
        electron.ipcRenderer.removeAllListeners("switchToFull");
        electron.ipcRenderer.removeAllListeners("update_downloaded");
        electron.ipcRenderer.removeAllListeners("update_available");
        electron.ipcRenderer.removeAllListeners("check_for_updates");
        electron.ipcRenderer.removeAllListeners("refresh");
      }
    };
  });
  useEffect(() => {
    if (refreshRequired) {
      inactivityTime();
    }
  }, [refreshRequired]);
  window.setUpdateAvailable = setUpdateAvailable;
  window.setUpdateDownloaded = setUpdateDownloaded;
  const updateHandler = () => {
    if (electron) electron.ipcRenderer.send("update_app");
    setUpdateDownloaded(true);
  };
  const handleCloseAlert = () => {
    dispatch(hideAlert());
  };

  const unmuteAudio = () => {
    if (unmuted) {
      return;
    }
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.src = SOUNDS.get("answered").audio;
    remoteVideo.currentTime = 0;
    remoteVideo.volume = 0.01;
    remoteVideo.muted = false;
    remoteVideo.loop = false;
    setUnmuted(true);
    remoteVideo.play().then(() => {
      remoteVideo.pause();
      remoteVideo.volume = 1;
    });
    audioPlayer.initialize();
  };

  return (
    <AppErrorBoundry>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider>
            <Loader />
            <Error error={error} />
            <If condition={!error}>
              <div
                onTouchStart={unmuteAudio}
                onClick={unmuteAudio}
                className="app"
              >
                <Router />
              </div>
            </If>
            <Alert
              message={alert.message}
              open={alert.open}
              closeHandler={handleCloseAlert}
            />
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={updateDownloaded}
              ContentProps={{
                "aria-describedby": "message-id",
              }}
              message={
                <span id="message-id">
                  An update is available. Please install it to get the latest
                  features.
                </span>
              }
              action={[
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={updateHandler}
                >
                  Update and Restart
                </Button>,
              ]}
            />
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={refreshRequired}
              ContentProps={{
                "aria-describedby": "message-id",
              }}
              message={
                <span id="message-id">
                  An update is available. Please refresh the app.
                </span>
              }
              action={[
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    window.location.reload(1);
                  }}
                >
                  Refresh
                </Button>,
              ]}
            />
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={updateAvailable && !updateDownloaded}
              ContentProps={{
                "aria-describedby": "message-id",
              }}
              message={
                <span id="message-id">An update is being downloaded.</span>
              }
              action={[
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setUpdateAvailable(false);
                  }}
                >
                  Close
                </Button>,
              ]}
            />
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </AppErrorBoundry>
  );
};
export default App;
