import React from "react";
import PropTypes from "prop-types";
import { Button, Chip } from "@material-ui/core";
import { Phone, CallEnd } from "@material-ui/icons";
import Logger from "../Managers/Logger";
import TransitionAppear from "./TransitionAppear";
import { withStyles } from "@material-ui/styles";
import audioPlayer, { SOUNDS } from "../Managers/audioPlayer";
import APIManager from "../Managers/APIManager";
import { getPhoneNumber } from "../utils";
import { setCNAME } from "../redux/actionCreators/thunk/setCNAME";
import { connect } from "react-redux";

const AnswerIcon = Phone;
const RejectIcon = CallEnd;
const logger = new Logger("Incoming");
const styles = {
  hidden: {
    display: "none",
  },
  controlsContainer: {},
  controls: {
    display: "flex",
    justifyContent: "space-around",
    width: 100,
  },
  control: {
    backgroundColor: "#333",
    borderRadius: 7,
    color: "#fff",
    padding: "5px",
  },
  wrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  callbuttons: {
    marginLeft: 5,
  },
  status: {},
};

class Incoming extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideo = document.getElementById("remoteVideo");
  }

  componentDidMount() {
    const session = this.props.incomingSession;
    const display_name = session.remote_identity.display_name;
    const incomingNumber = session._request.from._uri._user;
    const phonenumber = getPhoneNumber(incomingNumber);
    const namesArr = display_name.match(/[A-Za-z]+/gm);
    if (!namesArr || !namesArr.length || !phonenumber) {
      return;
    }
    const name = namesArr.filter((n) => n).join(" ");
    this.props.setCNAME(phonenumber, name);
  }

  render() {
    const session = this.props.incomingSession;
    const name = session.remote_identity.display_name;
    const classes = this.props.classes;
    if (this.props.mini) return null;
    return (
      <TransitionAppear duration={1000}>
        <div className={classes.wrapper} data-component="Incoming">
          <Chip label={name} />
          <div className="buttons">
            <Button
              variant="contained"
              color="secondary"
              icon={<AnswerIcon color="primary" />}
              className={classes.callbuttons}
              onClick={this.handleClickAnswer.bind(this)}
            >
              Answer
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.callbuttons}
              icon={<RejectIcon color="secondary" />}
              onClick={this.handleClickReject.bind(this)}
            >
              Reject
            </Button>
          </div>
        </div>
      </TransitionAppear>
    );
  }

  handleClickAnswer() {
    logger.debug("handleClickAnswer()");

    this.props.onAnswer();
  }

  handleClickReject() {
    logger.debug("handleClickReject()");

    this.props.onReject();
  }
}

Incoming.propTypes = {
  incomingSession: PropTypes.object.isRequired,
  onAnswer: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default connect(null, { setCNAME })(withStyles(styles)(Incoming));
