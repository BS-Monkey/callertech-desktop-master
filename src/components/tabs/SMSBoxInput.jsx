import React, { Component } from "react";
import { connect } from "react-redux";
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
const styles = {
  messageBox: {
    marginTop: 0,
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
    // position: "absolute",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 20,
  },
};

class SMSBoxInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  componentDidMount() {}
  componentWillUnmount() {
    if (this.intervals) {
      clearInterval(this.intervals);
    }
  }
  componentDidUpdate(prevProps) {}

  handleOpenDialog() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      this.sendMMS(input);
    };
    input.click();
  }

  sendMMS(input) {
    console.log("file:", input);
    if (!input.files.length) {
      return;
    }
    const did = getPhoneNumber(this.props.did.caller_id);
    const phonenumber = getPhoneNumber(this.props.phonenumber);
    this.props.sendMMS(input.files[0], did, phonenumber);
    this.setState({ text: "" });
  }

  downloadHandler(message) {
    if (message.type == "file") {
      if (window.electron) {
        window.electron.shell.openExternal(message.data.uri);
      }
    }
  }

  sendSMS() {
    console.log("click handler");
    const did = getPhoneNumber(this.props.did.caller_id);
    const phonenumber = getPhoneNumber(this.props.phonenumber);
    console.log("inr phonenumber", phonenumber);
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
    return (
      <Paper className={classes.messageBox}>
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
    );
  }
}
const mapStateToProps = ({ messages, app, sip }, ownProps) => ({
  messages: messages[ownProps.phonenumber],
  did: sip.data[app.num],
});
export default withStyles(styles)(
  connect(mapStateToProps, { sendSMS, sendMMS })(SMSBoxInput)
);
