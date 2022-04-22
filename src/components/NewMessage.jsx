import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState, Fragment } from "react";
import RateReviewIcon from "@material-ui/icons/RateReview";
import PhoneNumberInput from "./PhoneNumberInput";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { getPhoneNumber } from "../utils";
import sendMMS from "../redux/actionCreators/thunk/sendMMS";
import sendSMS from "../redux/actionCreators/thunk/sendSMS";
import audioPlayer from "../Managers/audioPlayer";
const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
  },
  inputWrapper: {
    width: 290,
  },
  iconButton: {
    padding: 6,
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    bottom: 0,
    marginTop: "15px",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 20,
  },
});

export function NewMessage() {
  const [open, setOpen] = useState(false);
  const [num, setNum] = useState("");
  const [text, setText] = useState("");
  const did = useSelector((state) => state.sip.data[state.app.num]);
  const dispatch = useDispatch();
  const handleSendMMS = (input) => {
    console.log("file:", input);
    if (!input.files.length) {
      return;
    }
    const _did = getPhoneNumber(did.caller_id);
    const _phonenumber = getPhoneNumber(num);
    dispatch(sendMMS(input.files[0], _did, _phonenumber));
    setText("");
    handleClose();
  };

  const handleOpenDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      handleSendMMS(input);
    };
    input.click();
  };

  const handleSendSMS = () => {
    const _did = getPhoneNumber(did.caller_id);
    const _phonenumber = getPhoneNumber(num);
    dispatch(
      sendSMS(
        {
          msg: text,
          from: _did,
          to: _phonenumber,
        },
        _did,
        _phonenumber
      )
    );
    setText("");
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
    setNum("");
    setText("");
  };

  const handleSend = () => {};
  const classes = useStyles();
  return (
    <Fragment>
      <Tooltip title="New SMS">
        <IconButton onClick={handleOpen} color={"primary"}>
          <RateReviewIcon />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>New SMS</DialogTitle>
        <DialogContent>
          <Paper className={classes.root}>
            <PhoneNumberInput
              placeholder="Phone Number"
              value={num}
              onChange={(event) => {
                setNum(event.target.value.replace(/-/g, ""));
              }}
              inputProps={{ "aria-label": "Phone Number" }}
            />
          </Paper>
          <Paper className={classes.inputBox}>
            <InputBase
              multiline={true}
              className={classes.input}
              fullWidth
              value={text}
              onChange={(ev) => {
                setText(ev.target.value);
              }}
            />
            <Tooltip title="Attach a File">
              <span>
                <IconButton
                  type="submit"
                  aria-label="Attach a File"
                  className={classes.iconButton}
                  onClick={handleOpenDialog}
                >
                  <AttachFileIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Send Message">
              <span>
                <IconButton
                  type="button"
                  aria-label="Show"
                  className={classes.iconButton}
                  onClick={handleSendSMS}
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
