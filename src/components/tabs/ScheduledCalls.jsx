import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { KEYS } from "../../redux/reducers/tabs";
import {
  Typography,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  IconButton,
  Button
} from "@material-ui/core";
import CallButton from "../CallButton";
import { Delete as DeleteIcon } from "@material-ui/icons";
import fetchScheduledCalls from "../../redux/actionCreators/thunk/fetchScheduledCalls";
import Scheduler from "../Scheduler";
import APIManager from "../../Managers/APIManager";
import Notes from "../Notes";

const useStyles = makeStyles({
  flexCol: {
    display: "flex",
    alignItems: "center"
  },
  unread: {
    display: "block",
    width: 10,
    height: 10,
    background: "red",
    borderRadius: 5,
    margin: 5
  },
  center: {
    paddingTop: 20,
    textAlign: "center"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 10px 0px 0"
  }
});
const ScheduledCalls = ({ value }) => {
  const calls = useSelector(({ scheduled_calls }) => scheduled_calls);
  const dispatch = useDispatch();
  useEffect(() => {
    if (value == KEYS.indexOf("schedule")) {
      console.log("fetching schedule again");
      dispatch(fetchScheduledCalls());
    }
  }, [value]);
  const classes = useStyles();
  return (
    <Container>
      <div className={classes.topBar}>
        <Scheduler />
        {/* <Button>Connect with Outlook</Button> */}
      </div>
      <If condition={calls.length}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Person</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Call</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.map(call => {
              return (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className={classes.flexCol}>
                      {call.default_name} <br />
                      {call.formattedNumber}
                    </div>
                  </TableCell>
                  <TableCell>{call.formattedTime}</TableCell>
                  <TableCell>
                    <CallButton phonenumber={call.phonenumber} />
                  </TableCell>
                  <TableCell>
                    <Notes phonenumber={call.phonenumber} />
                  </TableCell>
                  <TableCell>
                    <Scheduler
                      phonenumber={call.phonenumber}
                      time={call.time}
                      edit={call.id}
                      icon
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        APIManager.deleteScheduledCall(call.id).then(() => {
                          dispatch(fetchScheduledCalls());
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </If>
      <If condition={!calls.length}>
        <Typography className={classes.center} variant="body1">
          No Scheduled Calls
        </Typography>
      </If>
    </Container>
  );
};

export default ScheduledCalls;
