import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";

const electron = window.electron;
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 99999,
    backgroundColor: "#fff"
  },
  hidden: {
    display: "none"
  },
  center: {
    textAlign: "center"
  }
}));
const Error = ({ error }) => {
  const classes = useStyles();
  const className = error ? classes.root : classes.hidden;
  const handleRestart = () => {
    if (electron) electron.ipcRenderer.send("restart_app");
  };
  return (
    <div className={className}>
      <div className={classes.center}>
        <Typography variant="h4">{error}</Typography>
        <br />
        <Typography variant="h5">
          We are sorry for inconvinience. Please try restarting the app.
        </Typography>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleRestart}
        >
          Restart
        </Button>
      </div>
    </div>
  );
};
export default Error;
