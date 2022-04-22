import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import APIManager from "../Managers/APIManager";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
export default function EmailDemographics({ phonenumber }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("primary");
  const [disabled, setDisabled] = useState("primary");

  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setStatus("secondary");
      setDisabled(true);
      setError(false);
      APIManager.sendDemographics(phonenumber, email).then(success => {
        setDisabled(false);
        if (success) {
          dispatch(
            enqueueSnackbar({
              message: "Email has been sent successfully",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "success"
              }
            })
          );
        } else {
          dispatch(
            enqueueSnackbar({
              message: "Couldn't send the email. Please try again.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "warning"
              }
            })
          );
        }
        handleClose();
      });
    } else {
      setError(true);
    }
  };

  const handleChange = e => {
    setEmail(e.target.value);
  };
  return (
    <Fragment>
      <Tooltip title="Email Demographics Report">
        <IconButton
          color={status}
          onClick={() => {
            setOpen(true);
            setDisabled(false);
          }}
          size="small"
          aria-label="Email Demographics Report."
        >
          <EmailIcon />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Email Demographic Report</DialogTitle>
        <DialogContent>
          <TextField
            error={error}
            helperText={error ? "Please enter a valid email address." : ""}
            id="outlined-basic"
            label="Email"
            margin="normal"
            variant="outlined"
            type="email"
            onChange={handleChange}
            value={email}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={disabled} onClick={handleSend}>
            Send
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
