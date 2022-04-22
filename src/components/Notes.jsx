import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import APIManager from "../Managers/APIManager";
import addNotes from "../redux/actionCreators/addNotes";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  OutlinedInput,
  Tooltip
} from "@material-ui/core";
import NoteIcon from "@material-ui/icons/Note";
import updateActiveCampaign from "../redux/actionCreators/updateActiveCampaign";

export default function Notes({ phonenumber }) {
  const [open, setOpen] = useState(false);
  const savedNotes = useSelector(state => state.notes[phonenumber] || {});
  const [notes, setNotes] = useState("");
  const paused = useSelector(({ phone }) => phone.paused);
  const [wasPaused, setWasPaused] = useState(false);

  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    if (!wasPaused) {
      dispatch(updateActiveCampaign({ paused: 0 }));
    }
  };
  const handleSave = () => {
    APIManager.saveNotes(phonenumber, notes).then(success => {
      if (success) dispatch(addNotes({ [phonenumber]: { text: notes } }));
      handleClose();
    });
  };
  const handleOpen = () => {
    setOpen(true);
    setNotes(savedNotes.text || "");
    if (!paused) {
      dispatch(updateActiveCampaign({ paused: 1 }));
      setWasPaused(false);
    }
  };
  return (
    <Fragment>
      <Tooltip title="Notes">
        <IconButton
          color={savedNotes.text ? "secondary" : "primary"}
          onClick={handleOpen}
          aria-label="Notes regarding this person."
          size="small"
        >
          <NoteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        scroll="paper"
        fullWidth={true}
        maxWidth="md"
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <OutlinedInput
            multiline={true}
            onChange={e => {
              setNotes(e.target.value);
            }}
            fullWidth={true}
            rows={6}
            value={notes}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
