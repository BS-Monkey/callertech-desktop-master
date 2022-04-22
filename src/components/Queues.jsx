import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleQueue as toggleQueueAction } from "../redux/actionCreators/QueuesActions";
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
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import fetchQueues from "../redux/actionCreators/thunk/fetchQueues";
import makeCall from "../redux/actionCreators/makeCall";
const useStyles = makeStyles({
  red: {
    color: "red",
  },
  root: {
    padding: 5,
  },
});
const Queues = () => {
  const classes = useStyles();
  const { loaded, data: queues } = useSelector(({ queues }) => queues);
  const canCall = useSelector(({ phone }) => phone.state === "waiting");
  const [anchorEl, setAnchorEl] = useState(false);
  const dispatch = useDispatch();
  const handleOpen = (e) => {
    if (!anchorEl) dispatch(fetchQueues());
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };
  const handleToggleQueue = (queue) => {
    setAnchorEl(null);
    if (queue.joined) {
      dispatch(makeCall("*23" + queue.id));
    } else {
      dispatch(makeCall("*22" + queue.id));
    }
    dispatch(toggleQueueAction(queue));
  };
  return (
    <Fragment>
      <Button variant="contained" onClick={handleOpen} startIcon={<ListIcon />}>
        Manage Queues
      </Button>
      <If condition={anchorEl}>
        <Popper open={!!anchorEl} anchorEl={anchorEl} placement="left-start">
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <Paper className={classes.root}>
              {!loaded ? (
                "Loading..."
              ) : queues && queues.length ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queues.map((queue) => {
                      if (!queue) return "";
                      return (
                        <TableRow key={queue.id}>
                          <TableCell>{queue.name}</TableCell>
                          <TableCell>
                            <Button
                              disabled={!canCall}
                              onClick={() => handleToggleQueue(queue)}
                            >
                              {queue.joined ? "Logout" : "Login"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="h6">No Queues!</Typography>
              )}
            </Paper>
          </ClickAwayListener>
        </Popper>
      </If>
    </Fragment>
  );
};

export default Queues;
