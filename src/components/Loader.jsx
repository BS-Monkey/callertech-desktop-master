import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector } from "react-redux";

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
  }
}));
const Loader = () => {
  const classes = useStyles();
  const loading = useSelector(state => state.app.loading);
  const className = loading ? classes.root : classes.hidden;
  return (
    <div className={className}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
