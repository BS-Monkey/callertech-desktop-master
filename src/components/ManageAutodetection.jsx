import React, { Fragment, useState } from "react";
import APIManager from "../Managers/APIManager";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Formik, Form, Field } from "formik";
import { TextField, SimpleFileUpload } from "formik-material-ui";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Paper,
} from "@material-ui/core";
import settings from "../settings";
import addHotFile from "../redux/actionCreators/addHotFile";
import Link from "./Link";
import { autodetectionMessagesSelector } from "../redux/autodetection/autodetection.selector";
import {
  deleteAutodetection,
  fetchAutodetections,
} from "../redux/autodetection/autodetection.thunk";
import { addAutodetection } from "../redux/autodetection/autodetection.actions";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
const useStyles = makeStyles({
  btnGroup: {},
  filesContainer: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center'
  },
  dropzone: {
    padding: 20,
    marginTop: 10,
    minHeight: 75,
    backgroundColor: "#fefefe",
    cursor: "pointer",
  },
  uploadedFiles: {
    backgroundColor: "#fefefe",
    padding: 20,
  },
  form: {
    padding: 20,
    backgroundColor: "#fefefe",

    textAlign: "center",
  },
});
export const ManageAutodetection = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const autodetectionMessages = useSelector(autodetectionMessagesSelector);

  const handleDelete = (id) => {
    dispatch(deleteAutodetection(id));
  };

  const handleValidate = (values) => {
    const errors = {};
    if (!values.keywords) {
      errors.keywords = "Keywords are required";
    }
    if (!values.shortname) {
      errors.shortname = "Name is required";
    } else if (values.shortname.length > 25) {
      errors.shortname = "Name should be less than 25 characters";
    }
    if (!values.text && !values.file) {
      errors.text = "Either select a file or enter a message.";
      errors.file = "Either select a file or enter a message.";
    }
    return errors;
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    APIManager.createAutodetection(values).then((response) => {
      setSubmitting(false);
      console.log(response);
      if (response && response.status == "success") {
        dispatch(fetchAutodetections());
        dispatch(
          enqueueSnackbar({
            message: "Saved",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "success",
            },
          })
        );
      }
    });
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        Autodetection Messages
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <DialogTitle>Add/Remove Autodetection Messages</DialogTitle>
        <DialogContent>
          <Typography varaint="body1">
            Send Files and Messages when the caller speaks the keywords
          </Typography>
          <If condition={autodetectionMessages.length}>
            <Divider />
            <Paper className={classes.uploadedFiles}>
              <Typography variant="h6">Autodetection Messages</Typography>
              <Table size="small" className="filesContainer">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {autodetectionMessages.map((message, index) => (
                    <TableRow key={index}>
                      <TableCell>{message.shortname}</TableCell>
                      <TableCell>{message.keywords}</TableCell>
                      <TableCell>
                        <Link
                          href={
                            message.filename
                              ? `${settings.base_url}/uploads/mms/${encodeURI(
                                  message.filename
                                )}`
                              : ""
                          }
                        >
                          {message.filename}
                        </Link>
                      </TableCell>
                      <TableCell>{message.text}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            handleDelete(message.id, index);
                          }}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </If>
          <br />
          <Divider />
          <br />

          <Paper className={classes.form}>
            <Typography variant="h6">Add Autodetection Message</Typography>
            <Formik
              initialValues={{
                text: "",
                shortname: "",
              }}
              validate={handleValidate}
              onSubmit={handleSubmit}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Field
                    component={TextField}
                    name="shortname"
                    fullWidth
                    type="text"
                    label="Name"
                  />
                  <br />
                  <Field
                    component={TextField}
                    name="keywords"
                    fullWidth
                    type="text"
                    label="Keywords"
                  />
                  <Typography variant="caption">
                    Seperate keywords by comma <b>,</b>
                  </Typography>
                  <br />
                  <Field
                    component={TextField}
                    type="text"
                    multiline
                    fullWidth
                    rows={3}
                    label="Message"
                    name="text"
                  />
                  <Field
                    component={SimpleFileUpload}
                    label="File"
                    name="file"
                    fullWidth
                  />
                  {isSubmitting && <LinearProgress />}
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
