import React, { Fragment } from "react";
import {
  makeStyles,
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  Button,
} from "@material-ui/core";
import { useState } from "react";
import { Phone, CallEnd, Backspace } from "@material-ui/icons";
import { useEffect } from "react";

const numericKeyboard = [
  [
    { num: "1", str: "" },
    { num: "2", str: "ABC" },
    { num: "3", str: "DEF" },
  ],
  [
    { num: "4", str: "GHI" },
    { num: "5", str: "JKL" },
    { num: "6", str: "MNO" },
  ],
  [
    { num: "7", str: "PQRS" },
    { num: "8", str: "TUV" },
    { num: "9", str: "WXYZ" },
  ],
  [
    { num: "*", str: "" },
    { num: "0", str: "" },
    { num: "#", str: "" },
  ],
  ["call", "back", "end"],
];
const useStyles = makeStyles({
  root: {
    // marginTop: 30,
    width: "100%",
  },
  input: {
    display: "none",
  },
  keypad: {
    minWidth: 150,
    // width: 200
    // height: 200
    backgroundColor: "#FAF3E4",
  },
  key: {
    padding: 8,
  },
  keypadRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    "&:last-child": {
      marginTop: -10,
    },
  },
  roundButton: {
    borderRadius: 22,
    padding: 5,
    minWidth: 30,
    "& .MuiButton-label": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 0,
      width: 30,
      height: 30,
    },
  },
  btntop: {
    fontSize: 20,
    color: "#444",
    fontWeight: 400,
    lineHeight: "20px",
  },
  btnbottom: {
    fontWeight: 600,
    color: "rgba(0,0,0,0.65)",
    fontSize: 10,
    lineHeight: "10px",
  },
  keyMini: {},
});
const Keypad = ({ anchorEl, propOpen, sendInput, mini }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    // if (propOpen) {
    setOpen(!open);
    // }
  }, [propOpen]);
  const Wrapper = mini ? Paper : Popper;
  return (
    <Fragment>
      <Wrapper
        placement="top-start"
        open={mini || open}
        className={mini ? classes.root : null}
        anchorEl={anchorEl && anchorEl ? anchorEl : null}
      >
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
          }}
        >
          <Paper className={classes.keypad}>
            {numericKeyboard.map((row, i) => (
              <div key={i} className={classes.keypadRow}>
                {row.map((key, i) =>
                  typeof key == "object" ? (
                    <Button
                      onClick={() => {
                        sendInput(key.num);
                      }}
                      key={i}
                      className={classes.roundButton}
                    >
                      <span className={classes.btntop}>{key.num}</span>
                      <span className={classes.btnbottom}>{key.str || ""}</span>
                    </Button>
                  ) : (
                    <IconButton
                      color={key == "call" ? "secondary" : "primary"}
                      type={"button"}
                      key={i}
                      className={classes.key}
                      onClick={() => {
                        sendInput(key);
                      }}
                    >
                      <Choose>
                        <When condition={key == "call"}>
                          <Phone />
                        </When>
                        <When condition={key == "end"}>
                          <CallEnd />
                        </When>
                        <When condition={key == "back"}>
                          <Backspace />
                        </When>
                        <Otherwise>
                          <span className={classes.key}>
                            {key == "-" ? "" : key}
                          </span>
                        </Otherwise>
                      </Choose>
                    </IconButton>
                  )
                )}
              </div>
            ))}
          </Paper>
        </ClickAwayListener>
      </Wrapper>
    </Fragment>
  );
};
export default Keypad;
