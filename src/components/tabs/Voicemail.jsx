import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Button,
} from "@material-ui/core";
import CallButton from "../CallButton";
import makeCall from "../../redux/actionCreators/makeCall";
import {
  allVoicemailSelector,
  voicemailLoadedSelector,
} from "../../redux/selectors/voicemail";
import { readVoicemail } from "../../redux/actionCreators/thunk/readVoicemail";

const useStyles = makeStyles({
  flexCol: {
    display: "flex",
    alignItems: "center",
  },
  unread: {
    display: "block",
    width: 10,
    height: 10,
    background: "red",
    borderRadius: 5,
    margin: 5,
  },
  center: {
    paddingTop: 20,
    textAlign: "center",
  },
});
const Voicemail = () => {
  const voicemails = useSelector(allVoicemailSelector);
  const loaded = useSelector(voicemailLoadedSelector);
  const dispatch = useDispatch();
  const markVMAsRead = (id) => {
    dispatch(readVoicemail(id));
  };
  const classes = useStyles();
  return (
    <Container>
      <br />
      <Button
        onClick={() => {
          dispatch(makeCall("*97"));
        }}
      >
        VM Setup and Admin Access
      </Button>
      <If condition={!loaded}>
        <Typography className={classes.center} variant="body1">
          Loading...
        </Typography>
      </If>
      <If condition={loaded && voicemails.length}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Caller</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Recording</TableCell>
              <TableCell>Call</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voicemails.map((vm) => {
              return (
                <TableRow key={vm.id}>
                  <TableCell>
                    <div className={classes.flexCol}>
                      <If condition={!vm.is_read}>
                        <span className={classes.unread}></span>
                      </If>
                      <span>{vm.callerFormatted}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vm.time}</TableCell>
                  <TableCell>
                    <audio
                      src={vm.url}
                      preload="metadata"
                      controls
                      onPlay={() => markVMAsRead(vm.id)}
                      onClick={() => markVMAsRead(vm.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <CallButton phonenumber={vm.caller} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </If>
      <If condition={loaded && !voicemails.length}>
        <Typography className={classes.center} variant="body1">
          No Voicemail
        </Typography>
      </If>
    </Container>
  );
};

export default Voicemail;
