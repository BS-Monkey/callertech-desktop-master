import { MessageList } from "react-chat-elements";
import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Tooltip,
  IconButton,
  InputBase,
  makeStyles,
  Toolbar,
  AppBar,
} from "@material-ui/core";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  AssignmentInd,
} from "@material-ui/icons";
import CallButton from "./CallButton";
import { useDispatch, useSelector } from "react-redux";
import { changeCallNum } from "../redux/actionCreators/changeCallNum";
import { changeTab } from "../redux/actionCreators/tabs.actions";
import sendMMS from "../redux/actionCreators/thunk/sendMMS";
import sendSMS from "../redux/actionCreators/thunk/sendSMS";
import audioPlayer from "../Managers/audioPlayer";
import fetchSMS from "../redux/actionCreators/thunk/fetchSMS";
import { messageListSelector } from "../redux/selectors/conversations";
import HotFileButtons from "./HotFileButtons";
import { readSMS } from "../redux/actionCreators/thunk/readSMS";
import { useDropzone } from "react-dropzone";
import { didSelector } from "../redux/selectors/did.selector";
import { formatNational, getPhoneNumber } from "../utils";

const useStyles = makeStyles({
  messageList: {
    height: "calc(100vh - 280px)",
  },
  messageBox: {
    position: "relative",
    paddingBottom: "50px",
  },
  title: {
    flexGrow: 1,
  },
  titlebar: {
    backgroundColor: "#efefef",
    padding: "5px 15px",
  },
  iconButton: {
    padding: 6,
  },
  inputBox: {
    padding: "2px 5px",
    display: "flex",
    alignItems: "center",
    width: "calc(100% - 40px)",
    bottom: 0,
    marginLeft: "15px",
    position: "absolute",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 20,
  },
  drag: {
    background: "#f9e8dd",
  },
});

export function Conversation({ phonenumber }) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const messages = useSelector(messageListSelector(phonenumber));
  const did = useSelector(didSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(readSMS(did.caller_id, phonenumber));
  }, [phonenumber]);
  useEffect(() => {
    if (messages[0]) {
      setName(messages[0].name);
      setFormattedNumber(formatNational(phonenumber));
    } else {
      setName("New Conversation");
      setFormattedNumber("");
    }
  }, [phonenumber, messages]);
  useEffect(() => {
    const el = document.querySelector(".rce-container-mbox:last-child");
    if (el) el.scrollIntoView();
  }, [messages]);

  const handleSendMMS = (file) => {
    const _did = getPhoneNumber(did.caller_id);
    const _phonenumber = getPhoneNumber(phonenumber);
    dispatch(sendMMS(file, _did, _phonenumber));
    setText("");
  };

  const handleSendSMS = () => {
    const _did = getPhoneNumber(did.caller_id);
    const _phonenumber = getPhoneNumber(phonenumber);
    dispatch(
      sendSMS(
        {
          msg: text,
          from: _did,
          to: _phonenumber,
        },
        _did,
        _phonenumber
      )
    );
    setText("");
  };

  const downloadHandler = (message) => {
    if (message.type !== "text") {
      if (window.electron) {
        window.electron.shell.openExternal(message.data.uri);
      } else {
        window.open(message.data.uri);
      }
    }
  };

  const handleOpenDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      if (!input.files.length) {
        return;
      }
      handleSendMMS(input.files[0]);
    };
    input.click();
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log("accepted files", { acceptedFiles });
    if (acceptedFiles.length) {
      handleSendMMS(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const classes = useStyles();
  return (
    <div
      className={`${classes.messageBox} ${isDragActive ? classes.drag : ""}`}
      {...getRootProps({
        onClick: (ev) => {
          ev.stopPropagation();
        },
      })}
    >
      <input {...getInputProps()} />
      <AppBar color="default" position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            {name} {getPhoneNumber(name) ? "" : `- ${formattedNumber}`}
          </Typography>
          <HotFileButtons phonenumber={phonenumber} />
          <CallButton phonenumber={phonenumber} />
          <Tooltip title="Show Details">
            <IconButton
              onClick={() => {
                dispatch(changeCallNum(phonenumber, "manual"));
                dispatch(changeTab("details"));
              }}
              size="small"
            >
              <AssignmentInd />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <div>
        <MessageList
          toBottomHeight={"100%"}
          dataSource={messages}
          className={classes.messageList}
          onOpen={downloadHandler}
        />
      </div>
      <Paper className={classes.inputBox}>
        <InputBase
          multiline={true}
          className={classes.input}
          fullWidth
          value={text}
          onChange={(ev) => {
            setText(ev.target.value);
          }}
        />
        <Tooltip title="Attach a File">
          <span>
            <IconButton
              type="submit"
              aria-label="Attach a File"
              className={classes.iconButton}
              onClick={handleOpenDialog}
            >
              <AttachFileIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Send Message">
          <span>
            <IconButton
              type="button"
              aria-label="Show"
              className={classes.iconButton}
              onClick={handleSendSMS}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
    </div>
  );
}
