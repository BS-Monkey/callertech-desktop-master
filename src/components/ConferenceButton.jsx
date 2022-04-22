import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PeopleIcon from "@material-ui/icons/People";
import {
  IconButton,
  makeStyles,
  Popper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Tooltip,
  ClickAwayListener,
  Button,
  Box,
  FormControl,
  TextField,
} from "@material-ui/core";
import fetchQueues from "../redux/actionCreators/thunk/fetchQueues";
import APIManager from "../Managers/APIManager";
import { GroupAdd } from "@material-ui/icons";
import { userDataSelector } from "../redux/settings/settings.selector";
const useStyles = makeStyles({
  red: {
    color: "red",
  },
  root: {
    padding: 5,
  },
});
const ConferenceButton = ({ session, onCall }) => {
  const classes = useStyles();
  const userData = useSelector(userDataSelector);
  const [conferences, setConferences] = useState(null);
  const [name, setName] = useState("");
  const fetchConferences = () => {
    APIManager.fetchConferences().then(({ data }) => {
      setConferences(data);
    });
  };
  useEffect(fetchConferences, [userData]);
  const [anchorEl, setAnchorEl] = useState(false);
  const handleOpen = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleCall = (extension) => {
    setAnchorEl(null);
    onCall(extension);
  };

  const handleTransfer = (extension) => {
    setAnchorEl(null);
    console.log("transferring to ", extension);
    session.refer(extension);
    setTimeout(() => {
      onCall(extension);
    }, 1000);
  };

  const handleDelete = (id) => {
    APIManager.deleteConference(id).then(() => {
      fetchConferences();
    });
  };

  const handleCreate = () => {
    APIManager.createConference(name).then(({ status }) => {
      if (status === "success") {
        setName("");
        fetchConferences();
      }
    });
  };

  return (
    <Fragment>
      <Tooltip title="Conferences">
        <IconButton onClick={handleOpen}>
          <GroupAdd />
        </IconButton>
      </Tooltip>
      <If condition={anchorEl}>
        <Popper open={!!anchorEl} anchorEl={anchorEl} placement="left-start">
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <Paper className={classes.root}>
              <Typography variant="h6">Conferences</Typography>
              <Box
                display="flex"
                justifyContent="flex-start"
                m={1}
                p={1}
                bgcolor="background.paper"
              >
                <TextField
                  label="Name"
                  onChange={(ev) => {
                    setName(ev.target.value);
                  }}
                  value={name}
                />
                <Button disabled={!name} onClick={handleCreate}>
                  Add Queue
                </Button>
              </Box>
              <If condition={conferences && conferences.length}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {conferences.map((conference) => {
                      if (!conference) return "";
                      return (
                        <TableRow key={conference.name}>
                          <TableCell>{conference.name}</TableCell>
                          <TableCell>
                            {session ? (
                              <Button
                                onClick={() => {
                                  handleTransfer(conference.extension);
                                }}
                              >
                                Transfer Call
                              </Button>
                            ) : (
                              <Button
                                disabled={session}
                                onClick={() => {
                                  handleCall(conference.extension);
                                }}
                              >
                                Call
                              </Button>
                            )}
                            <Button
                              onClick={() => {
                                handleDelete(conference.id);
                              }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </If>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </If>
    </Fragment>
  );
};

export default ConferenceButton;
