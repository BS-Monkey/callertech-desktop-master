import React from "react";
import { DialogTitle, Dialog } from "@material-ui/core";

export default function Alert({ open, message, closeHandler }) {
  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle id="simple-dialog-title">
        {message ? message : ""}
      </DialogTitle>
    </Dialog>
  );
}
