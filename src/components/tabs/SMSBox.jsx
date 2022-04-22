import React, { Component } from "react";
import { connect } from "react-redux";
import fetchSMS from "../../redux/actionCreators/thunk/fetchSMS";
import { MessageList } from "react-chat-elements";
import Linkify from "react-linkify";
import {
  withStyles,
  Paper,
  Typography,
  Input,
  Tooltip,
  IconButton,
  InputBase,
} from "@material-ui/core";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from "@material-ui/icons";
import Link from "../Link";
import moment from "moment";
import sendSMS from "../../redux/actionCreators/thunk/sendSMS";
import { getPhoneNumber } from "../../utils";
import sendMMS from "../../redux/actionCreators/thunk/sendMMS";
import audioPlayer from "../../Managers/audioPlayer";
import {
  messageGroupSelector,
  messageListSelector,
} from "../../redux/selectors/conversations";
import Dropzone from "react-dropzone";
const styles = {
  messageBox: {
    marginTop: 10,
    height: "calc(100vh - 348px)",
    position: "relative",
  },
  titlebar: {
    backgroundColor: "#efefef",
    padding: "5px 15px",
  },
  messageList: {
    height: "calc(100% - 90px)",
    overflowY: "auto",
    paddingBottom: 48,
  },
  iconButton: {
    padding: 6,
  },
  inputBox: {
    padding: "2px 5px",
    display: "flex",
    alignItems: "center",
    width: "calc(100% - 10px)",
    bottom: 0,
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
};

class SMSBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  componentDidMount() {
    this.fetchSMS();
    const el = document.querySelector("#msglist");
    el.scrollTop = el.scrollWidth + 400;
  }
  componentWillUnmount() {
    if (this.intervals) {
      clearInterval(this.intervals);
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.phonenumber != this.props.phonenumber ||
      prevProps.did.caller_id != this.props.did.caller_id
    )
      this.fetchSMS();
    const el = document.querySelector("#msglist");
    el.scroll(0, el.scrollHeight * 2);
  }

  fetchSMS() {
    if (!this.props.messageIds.includes(this.props.phonenumber)) {
      console.log("this.props.phonenumber", this.props.phonenumber);
      this.props.fetchSMS(this.props.did.caller_id, this.props.phonenumber);
    }
  }

  handleOpenDialog() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      if (!input.files.length) {
        return;
      }
      this.sendMMS(input.files[0]);
    };
    input.click();
  }

  onDrop(acceptedFiles) {
    console.log("accepted files", { acceptedFiles });
    if (acceptedFiles.length) {
      this.sendMMS(acceptedFiles[0]);
    }
  }

  sendMMS(file) {
    console.log("file:", file);
    const did = getPhoneNumber(this.props.did.caller_id);
    const phonenumber = getPhoneNumber(this.props.phonenumber);
    this.props.sendMMS(file, did, phonenumber);
    this.setState({ text: "" });
  }

  downloadHandler(message) {
    if (message.type !== "text") {
      if (window.electron) {
        window.electron.shell.openExternal(message.data.uri);
      } else {
        window.open(message.data.uri);
      }
    }
  }

  sendSMS() {
    console.log("click handler");
    const did = getPhoneNumber(this.props.did.caller_id);
    const phonenumber = getPhoneNumber(this.props.phonenumber);
    this.props.sendSMS(
      {
        msg: this.state.text,
        from: did,
        to: phonenumber,
      },
      did,
      phonenumber
    );
    this.setState({ text: "" });
  }

  render() {
    const classes = this.props.classes;
    const messages = this.props.messages;
    return (
      <Dropzone onDrop={this.onDrop.bind(this)}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <Paper
            {...getRootProps({
              onClick: (ev) => {
                ev.stopPropagation();
              },
            })}
            className={`${classes.messageBox} ${
              isDragActive ? classes.drag : ""
            }`}
          >
            <input {...getInputProps()} />
            <div className={classes.titlebar}>
              <Typography variant="h5">SMS</Typography>
            </div>
            <div className={classes.messageList} id="msglist">
              <MessageList
                toBottomHeight={"100%"}
                dataSource={messages}
                onOpen={this.downloadHandler}
              />
            </div>
            <Paper className={classes.inputBox}>
              <InputBase
                multiline={true}
                className={classes.input}
                fullWidth
                value={this.state.text}
                onChange={(ev) => {
                  this.setState({ text: ev.target.value });
                }}
              />
              <Tooltip title="Attach a File">
                <span>
                  <IconButton
                    type="submit"
                    aria-label="Attach a File"
                    className={classes.iconButton}
                    onClick={this.handleOpenDialog.bind(this)}
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
                    onClick={this.sendSMS.bind(this)}
                  >
                    <SendIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Paper>
          </Paper>
        )}
      </Dropzone>
    );
  }
}
const mapStateToProps = ({ messages, app, sip }, ownProps) => ({
  messages: messageListSelector(ownProps.phonenumber)({ messages }),
  latest_sms_id: messages.latest_sms_id,
  messageIds: messages.ids,
  did: sip.data[app.num],
});
export default withStyles(styles)(
  connect(mapStateToProps, { fetchSMS, sendSMS, sendMMS })(SMSBox)
);
