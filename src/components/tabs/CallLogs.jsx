import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  makeStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Container,
  IconButton,
  TableFooter,
  TablePagination,
  Tooltip,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import fetchCallLogs from "../../redux/actionCreators/thunk/fetchCallLogs";
import { KEYS } from "../../redux/reducers/tabs";
import {
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
  AssignmentInd,
} from "@material-ui/icons";
import moment from "moment";
import { formatNational } from "../../utils";
import settings from "../../settings";
import CallButton from "../CallButton";
import { changeCallNum } from "../../redux/actionCreators/changeCallNum";
import { changeTab } from "../../redux/actionCreators/tabs.actions";

const useStyles = makeStyles({});

const CallLogs = ({ value }) => {
  const call_logs = useSelector(({ call_logs }) => call_logs);
  const [page, setPage] = useState(1);
  const did = useSelector(({ sip, app }) => sip.data[app.num]);

  const dispatch = useDispatch();
  useEffect(() => {
    setPage(call_logs.current_page);
  }, [call_logs]);
  useEffect(() => {
    let refetch = false;
    if (value == KEYS.indexOf("call_logs")) refetch = true;
    if (refetch && did && did.caller_id)
      dispatch(fetchCallLogs(did.caller_id, page));
  }, [page, did, value]);
  const calls = call_logs.data.map((call) => {
    let status = "missed";
    let icon = CallMissedIcon;

    if (call.Direction == "inbound" && call.CallDuration > 0) {
      status = "in";
      icon = CallReceivedIcon;
    } else if (call.Direction == "outbound-api") {
      status = "out";
      icon = CallMadeIcon;
    }
    let time = moment.utc(call.call_time).local().format("h:mma MMM Do, YYYY");

    return {
      status,
      icon,
      time,
      formattedPhonenumber: formatNational(call.phonenumber),
      ...call,
    };
  });
  return (
    <Container>
      <Table>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={calls.sid || Math.random() * 100}>
              <TableCell>
                <Avatar alt={call.status}>
                  <call.icon />
                </Avatar>
              </TableCell>
              <TableCell>
                <span>
                  {call.name} <br />
                  {call.formattedPhonenumber}
                </span>
              </TableCell>
              <TableCell>{call.time}</TableCell>
              <TableCell>
                {call.recording ? (
                  <audio
                    src={`${settings.base_url}/clientuser/streammp3?callsid=${call.CallSid}`}
                    preload="metadata"
                    controls
                  />
                ) : (
                  <div>No Recording</div>
                )}
              </TableCell>
              <TableCell>
                <CallButton phonenumber={call.phonenumber} />
                <Tooltip title="Show Details">
                  <IconButton
                    onClick={() => {
                      dispatch(changeCallNum(call.phonenumber, "manual"));
                      dispatch(changeTab("details"));
                    }}
                    size="small"
                  >
                    <AssignmentInd />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={call_logs.total || 0}
              page={page - 1}
              rowsPerPageOptions={[call_logs.per_page || 10]}
              rowsPerPage={call_logs.per_page || 10}
              onChangePage={(ev, newPage) => {
                console.log(newPage);
                setPage(newPage + 1);
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Container>
  );
};

export default CallLogs;
