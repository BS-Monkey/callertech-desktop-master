import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@material-ui/core";
import APIManager from "../Managers/APIManager";
import { useDropzone } from "react-dropzone";
import { getPhoneNumber } from "../utils";
import { didSelector } from "../redux/selectors/did.selector";
import sendMMS from "../redux/actionCreators/thunk/sendMMS";
import { AgentRow } from "./AgentRow";
import { sendGroupMMS } from "../redux/actionCreators/thunk/sendGroupMMS";
import { agentLoadedSelector, agentsSelector } from "../redux/selectors/agents";
import { userDataSelector } from "../redux/settings/settings.selector";
const useStyles = makeStyles({
  red: {
    color: "red",
  },
  root: {
    padding: 5,
    height: "400px !important",
    overflowY: "auto",
  },
  drag: {
    background: "#f9e8dd !important",
  },
  dropzone: {
    height: "100px",
    background: "#eee",
    border: `1px dashed #444`,
    width: "100%",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    padding: "10px",
    "box-sizing": "border-box",
  },
});
const AgentsButton = ({ session, onCall, onTransfer }) => {
  const classes = useStyles();
  const userData = useSelector(userDataSelector);
  const did = useSelector(didSelector);
  const agents = useSelector(agentsSelector);
  const loaded = useSelector(agentLoadedSelector);
  const [mounted, setMounted] = useState(true);
  const dispatch = useDispatch();
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      console.log("accepted files", { acceptedFiles });
      if (acceptedFiles.length) {
        const phonenumbers = agents
          .filter((agent) => agent.extension !== did.username)
          .map((agent) => getPhoneNumber(agent.phonenumber));
        const _did = getPhoneNumber(did.caller_id);
        dispatch(sendGroupMMS(acceptedFiles[0], _did, phonenumbers));
      }
    },
    [agents]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, [userData]);
  const anchorEl = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (e) => {
    if (!mounted) return;
    setOpen(!open);
  };

  const handleSendMMS = (file, phonenumber) => {
    const _did = getPhoneNumber(did.caller_id);
    const _phonenumber = getPhoneNumber(phonenumber);
    dispatch(sendMMS(file, _did, _phonenumber));
  };

  // const handleToggleQueue = (queue) => {
  //   setAnchorEl(null);
  //   toggleQueue(queue);
  //   dispatch(toggleQueueAction(queue));
  // };
  return (
    <Fragment>
      <span ref={anchorEl}>
        <Tooltip title="Agents">
          <IconButton
            onClick={handleOpen}
            onDragEnter={() => (!open ? setOpen(true) : null)}
          >
            <PeopleIcon />
          </IconButton>
        </Tooltip>
      </span>
      <If condition={anchorEl.current}>
        <Popper open={open} anchorEl={anchorEl.current} placement="left-start">
          <ClickAwayListener onClickAway={handleOpen}>
            <Paper className={classes.root}>
              {!loaded ? (
                <Typography variant="body1">Loading...</Typography>
              ) : agents.length ? (
                <Fragment>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Extension</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agents.map((agent, i) => {
                        if (!agent) return "";
                        return (
                          <AgentRow
                            key={i}
                            agent={agent}
                            session={session}
                            setOpen={setOpen}
                            onCall={onCall}
                            onTransfer={onTransfer}
                            handleSendMMS={handleSendMMS}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div
                    className={`${classes.dropzone} ${
                      isDragActive ? classes.drag : ""
                    }`}
                    {...getRootProps({
                      onClick: (ev) => {
                        ev.stopPropagation();
                      },
                    })}
                  >
                    <input {...getInputProps()} />
                    <Typography variant={"body1"}>
                      Drop a file here and it gets sent to all the agents at
                      once.
                    </Typography>
                  </div>
                </Fragment>
              ) : (
                <Typography variant="h6">No Agents!</Typography>
              )}
            </Paper>
          </ClickAwayListener>
        </Popper>
      </If>
    </Fragment>
  );
};

export default AgentsButton;
