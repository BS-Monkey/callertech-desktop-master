import React, { useCallback, Fragment, useState } from "react";
import { getFilename } from "../utils";
import APIManager from "../Managers/APIManager";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { Delete as DeleteIcon, Add as AddIcon } from "@material-ui/icons";
import deleteHotFile from "../redux/actionCreators/thunk/deleteHotFile";
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
const ManageHotFiles = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const files = useSelector(({ hotfiles }) => hotfiles);

  const handleDelete = (id) => {
    dispatch(deleteHotFile(id));
  };

  const handleValidate = (values) => {
    const errors = {};
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
    APIManager.uploadFile(values).then((response) => {
      setSubmitting(false);
      console.log(response);
      if (response && response.status == "success") {
        dispatch(addHotFile(response.data));
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
        Quick Send Messages
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <DialogTitle>Add/Remove Quick Send Files/Messages</DialogTitle>
        <DialogContent>
          <Typography varaint="body1">
            Save Files and Messages To Quickly Send By SMS/MMS
          </Typography>
          <If condition={files.length}>
            <Divider />
            <Paper className={classes.uploadedFiles}>
              <Typography variant="h6">Saved Messages</Typography>
              <Table size="small" className="filesContainer">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>{file.shortname}</TableCell>
                      <TableCell>
                        <Link
                          href={
                            file.filename
                              ? `${settings.base_url}/uploads/mms/${encodeURI(
                                  file.filename
                                )}`
                              : ""
                          }
                        >
                          {file.filename}
                        </Link>
                      </TableCell>
                      <TableCell>{file.text}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            handleDelete(file.id, index);
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
          <If condition={files.length < 4}>
            <Paper className={classes.form}>
              <Typography variant="h6">Add Hot File/Message</Typography>
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
          </If>
          <If condition={files.length >= 4}>
            You can only save 4 files. Please delete already uploaded files
            first to add more.
          </If>
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

export default ManageHotFiles;
