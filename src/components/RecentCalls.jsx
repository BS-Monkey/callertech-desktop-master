import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import {
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  CallMissed as CallMissedIcon,
} from "@material-ui/icons";
import fetchRecentCalls from "../redux/actionCreators/thunk/fetchRecentCalls";
import moment from "moment";
import settings from "../settings";

const useStyles = makeStyles({
  heading: {
    justifyContent: "space-between",
    display: "flex",
    flexGrow: 1,
  },
  listLeft: {},
  listRight: {},
  details: {
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: 350,
  },
  subheading: {},
});
const RecentCalls = ({ phonenumber }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const num = useSelector(({ app }) => app.num);
  const did = useSelector(({ sip }) => sip.data[num]);

  useEffect(() => {
    dispatch(fetchRecentCalls(did.caller_id, phonenumber));
  }, [phonenumber, did]);

  const [callsIn, setCallsIn] = useState(0);
  const [callsOut, setCallsOut] = useState(0);

  const recentCallSids = useSelector(
    ({ recentcalls }) => recentcalls[phonenumber] || []
  );
  const recentCalls = useSelector(({ calls }) =>
    recentCallSids ? recentCallSids.map((sid) => calls[sid]) : []
  );
  const recordings = useSelector(({ recordings }) => recordings);
  const voicemail = useSelector(({ voicemail }) => voicemail.voicemails);
  useEffect(() => {
    const groupedCalls = _.countBy(recentCalls, function (item) {
      if (!item) return "error";
      return item.Direction == "inbound" ? "in" : "out";
    });
    setCallsIn(groupedCalls["in"] || 0);
    setCallsOut(groupedCalls["out"] || 0);
  }, [recentCalls]);
  const calls = recentCalls.map((recentCall) => {
    let status = "missed";
    let icon = CallMissedIcon;

    if (recentCall.Direction == "inbound" && recentCall.CallDuration > 0) {
      status = "in";
      icon = CallReceivedIcon;
    } else if (recentCall.Direction == "outbound-api") {
      status = "out";
      icon = CallMadeIcon;
    }
    let time = moment
      .utc(recentCall.call_time)
      .local()
      .format("h:mm:ss a MMM Do, YYYY");
    return { status, recording: recentCall.call_recording, icon, time };
  });
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className={classes.heading}>
          <Typography component="div">
            Recent Calls ({recentCallSids.length})
          </Typography>
          <Typography component="div" className={classes.subheading}>
            In ({callsIn}) Out ({callsOut})
          </Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <If condition={recentCalls.length}>
          <List>
            {calls.map((call, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar className={classes.listLeft}>
                  <Avatar alt={call.status}>
                    <call.icon />
                    {/* <If condition={call.status == 'missed'}><Miss</If> */}
                  </Avatar>
                </ListItemAvatar>
                <div className={classes.listRight}>
                  <If condition={call.recording && recordings[call.recording]}>
                    <audio
                      src={`${settings.base_url}/clientuser/streammp3?callsid=${
                        recordings[call.recording].CallSid
                      }`}
                      preload="metadata"
                      controls
                    />
                  </If>
                  <If condition={call.voicemail && voicemail[call.CallSid]}>
                    <audio
                      src={`${settings.base_url}/clientuser/streammp3?callsid=${call.CallSid}&voicerec=1`}
                      preload="none"
                      controls
                    />
                  </If>
                  <If condition={!call.recording}>
                    <div>No Recording</div>
                  </If>
                  <div>{call.time}</div>
                </div>
              </ListItem>
            ))}
          </List>
        </If>
        <If condition={!recentCalls.length}>
          <Typography variant="body1">No Calls</Typography>
        </If>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
export default RecentCalls;
