import React, { Fragment } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  makeStyles,
  Tooltip,
  OutlinedInput,
} from "@material-ui/core";
import { useState } from "react";
import { Schedule as ScheduleIcon, Edit as EditIcon } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import moment from "moment";
import ReactInputMask from "react-input-mask";
import { getPhoneNumber, formatNational } from "../utils";
import APIManager from "../Managers/APIManager";
import { useDispatch, useSelector } from "react-redux";
import fetchScheduledCalls from "../redux/actionCreators/thunk/fetchScheduledCalls";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
import { useEffect } from "react";

const useStyles = makeStyles({
  contentDialog: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
  },
  marginBottom: {
    marginBottom: 10,
  },
  notes: {
    width: "60%",
  },
});

const SchedulerDialog = ({
  open = false,
  time: defaultTime = "",
  phonenumber: defaultPhonenumber = "",
  edit = null,
  onSave = () => {},
  onClose = () => {},
}) => {
  let datetime = new Date();
  if (defaultTime) {
    datetime = moment(defaultTime).toDate();
  }
  const classes = useStyles();
  const [time, setTime] = useState(datetime);
  const [phonenumber, setPhonenumber] = useState(defaultPhonenumber);
  const savedNotes = useSelector(({ notes }) =>
    defaultPhonenumber ? notes[defaultPhonenumber] : null
  );
  const [notes, setNotes] = useState(defaultPhonenumber);
  const [error, setError] = useState(false);
  useEffect(() => {
    setTime(datetime);
    if (defaultPhonenumber) {
      setPhonenumber(defaultPhonenumber.replace("+1", ""));
    }
  }, [open]);
  useEffect(() => {
    if (savedNotes) {
      setNotes(savedNotes.text);
    }
  }, [savedNotes]);
  return (
    <Dialog maxWidth="xs" fullWidth onClose={onClose} open={open}>
      <DialogTitle className={classes.center}>
        {edit ? "Edit" : "New"} Scheduled Call
      </DialogTitle>
      <DialogContent className={classes.contentDialog}>
        <DateTimePicker
          className={classes.marginBottom}
          value={time}
          onChange={setTime}
        />
        <ReactInputMask
          mask="(999) 999-9999"
          value={phonenumber}
          className={classes.marginBottom}
          error={error}
          onChange={(e) => {
            setPhonenumber(e.target.value);
          }}
          onBlur={(e) => {
            if (!getPhoneNumber(e.target.value)) {
              setPhonenumber("");
              setError(true);
            } else {
              setError(false);
            }
          }}
        >
          {(inputProps) => (
            <TextField {...inputProps} label="Phone Number"></TextField>
          )}
        </ReactInputMask>
        <TextField
          multiline={true}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
          label="Notes"
          value={notes}
          row="3"
          size="medium"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onSave(time, phonenumber, notes);
          }}
        >
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const Scheduler = ({
  time = null,
  phonenumber = null,
  edit = null,
  icon = false,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const handleSave = (time, phonenumber, notes = "") => {
    handleClose();
    const utcTime = moment(time).utc().format("h:mm:ss a MMM Do, YYYY");
    APIManager.saveScheduledCall(utcTime, phonenumber, notes, edit).then(
      (response) => {
        if (response && response.status == "success") {
          dispatch(fetchScheduledCalls());
          dispatch(
            enqueueSnackbar({
              message: "Call has been scheduled.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "success",
              },
            })
          );
        } else {
          dispatch(
            enqueueSnackbar({
              message: "Couldn't schedule the call. Please try again.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "warning",
              },
            })
          );
        }
      }
    );
  };
  return (
    <Fragment>
      {icon ? (
        <Tooltip title={edit ? "Edit Schedule" : "Schedule Call"}>
          <IconButton size="small" onClick={handleOpen}>
            {edit ? <EditIcon /> : <ScheduleIcon />}
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant="contained" onClick={handleOpen}>
          {edit ? "Edit Schedule" : "Schedule a Call"}
        </Button>
      )}
      <SchedulerDialog
        open={open}
        time={time}
        phonenumber={phonenumber}
        edit={edit}
        onSave={handleSave}
        onClose={handleClose}
      />
    </Fragment>
  );
};

export default Scheduler;
