import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
import { loggedInToFb } from "../redux/settings/settings.actions";
import { fbAccessTokenSelector } from "../redux/settings/settings.selector";

export const FBLogin = (props) => {
  const fbAccessToken = useSelector(fbAccessTokenSelector);
  const dispatch = useDispatch();
  const handleFBLogin = () => {
    if (window.electron) {
      window.electron.ipcRenderer.send("fb-authenticate");
    } else {
      const loginPopup = window.open("./fb.html");
      setTimeout(() => loginPopup.postMessage("fb-authenticate"), 2000);
      loginPopup.addEventListener("message", (event) => {
        if (event.data && event.data.type === "fb-authenticated") {
          if (
            event.data.response.status === "connected" &&
            event.data.response.authResponse
          ) {
            dispatch(
              loggedInToFb(event.data.response.authResponse.accessToken)
            );
            dispatch(
              enqueueSnackbar({
                message: "Logged in to Facebook Successfully!",
                options: {
                  key: new Date().getTime() + Math.random(),
                  variant: "success",
                },
              })
            );
          } else {
            enqueueSnackbar({
              message: "Log in to Facebook Failed!",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "danger",
              },
            });
          }
          console.log(event.data);
        }
      });
    }
  };

  return (
    <Button
      onClick={handleFBLogin}
      disabled={fbAccessToken}
      variant={"contained"}
      color={"default"}
    >
      {fbAccessToken ? "Logged In to Facebook" : "Login to Facebook"}
    </Button>
  );
};
