import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "@material-ui/core";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";
import CallButton from "./CallButton";
import fetchScheduledCalls from "../redux/actionCreators/thunk/fetchScheduledCalls";
import moment from "moment";
import Notes from "./Notes";
const useStyles = makeStyles({
  red: {
    color: "red",
  },
  root: {
    padding: 5,
  },
});
const UpcomingCalls = () => {
  const classes = useStyles();
  const calls = useSelector(({ scheduled_calls }) => scheduled_calls);
  const [anchorEl, setAnchorEl] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchScheduledCalls());
  }, [anchorEl]);
  const handleOpen = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };
  let minDiff = 100000;
  const Calls =
    calls.map((call) => {
      let time = moment(call.time);
      let diff = time.diff(moment(), "seconds");
      call.diff = moment.duration(diff, "seconds").humanize();
      if (diff < minDiff) {
        minDiff = diff;
      }
      return call;
    }) || [];
  if (!calls || !calls.length) {
    return null;
  }
  return (
    <Fragment>
      <Tooltip title="Upcoming Calls">
        <IconButton
          className={minDiff < 5 * 60 ? classes.red : ""}
          onClick={handleOpen}
        >
          <CalendarIcon />
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
              {Calls.length ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Person</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Call</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Calls.map((call) => {
                      if (!call) return "";
                      return (
                        <TableRow key={call.id}>
                          <TableCell>
                            <div className={classes.flexCol}>
                              {call.default_name} <br />
                              {call.formattedNumber}
                            </div>
                          </TableCell>
                          <TableCell>{call.diff}</TableCell>
                          <TableCell>
                            <CallButton phonenumber={call.phonenumber} />
                          </TableCell>
                          <TableCell>
                            <Notes phonenumber={call.phonenumber} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="h6">No Calls Scheduled!</Typography>
              )}
            </Paper>
          </ClickAwayListener>
        </Popper>
      </If>
    </Fragment>
  );
};

export default UpcomingCalls;
