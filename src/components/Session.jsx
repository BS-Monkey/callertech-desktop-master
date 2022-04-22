/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import APIManager from "../Managers/APIManager";
import moment from "moment";
import { connect } from "react-redux";
import fetchRecentCalls from "../redux/actionCreators/thunk/fetchRecentCalls";
// import Timer from "./Timer";
import {
  CallEnd,
  PauseCircleFilledOutlined,
  PlayCircleFilledOutlined,
  Shuffle,
} from "@material-ui/icons";
import { Chip } from "@material-ui/core";
import JsSIP from "jssip";
import Logger from "../Managers/Logger";
import TransitionAppear from "./TransitionAppear";
import EchoManager from "../Managers/EchoManager";

const HangUpIcon = CallEnd;
const PauseIcon = PauseCircleFilledOutlined;
const ResumeIcon = PlayCircleFilledOutlined;
const logger = new Logger("Session");

const styles = {
  hidden: {
    display: "none",
  },
  session: {
    flexGrow: 1,
  },
  active: {
    backgroundColor: "#34CF58",
  },
  inactive: {
    backgroundColor: "#FFFCBB",
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
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  status: {},
};

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideo;
    this.state = {
      localHasVideo: false,
      remoteHasVideo: false,
      localHold: false,
      remoteHold: false,
      canHold: false,
      ringing: false,
      started: false,
      mediaStream: null,
    };
    // console.log(document.getElementById("localVideo"))
    this.remoteVideo = document.getElementById("remoteVideo");
    this.remoteVideo.onpause = () => {
      if (this._mounted) {
        this.remoteVideo.play();
      }
    };
    this.interval = null;

    // Mounted flag
    this._mounted = false;
    // Local cloned stream
  }

  componentDidUpdate() {
    if (this.props.state && !this.state.started) {
      this.setState({
        started: true,
      });
    }
  }

  render() {
    const state = this.state;
    const props = this.props;
    const classes = this.props.classes;

    if (props.mini) return null;
    let labelStatus = "";
    if (props.session.isInProgress() && !state.ringing)
      labelStatus = "Connecting";
    else if (state.ringing) labelStatus = "ringing";
    else if (state.localHold && state.remoteHold) labelStatus = "both hold";
    else if (state.localHold) labelStatus = "local hold";
    else if (state.remoteHold) labelStatus = "remote hold";
    else if (!state.remoteHasVideo) labelStatus = "Call In Progress";

    let label = `${
      props.session.remote_identity.display_name || ""
    } - ${labelStatus}`;

    return (
      <TransitionAppear duration={1000}>
        <div data-component="Session" className={classes.session}>
          <div className={classes.wrapper}>
            <Chip
              label={label}
              className={props.active ? classes.active : classes.inactive}
            />
            <div className={classes.controlsContainer}>
              <div className={classes.controls}>
                <HangUpIcon
                  className={classes.control}
                  color="primary"
                  onClick={this.handleHangUp.bind(this)}
                />
                <If condition={props.session_count <= 1}>
                  <Choose>
                    <When condition={!state.localHold}>
                      <PauseIcon
                        className={classes.control}
                        color="primary"
                        onClick={this.handleHold.bind(this)}
                      />
                    </When>

                    <Otherwise>
                      <ResumeIcon
                        className={classes.control}
                        color="primary"
                        onClick={this.handleResume.bind(this)}
                      />
                    </Otherwise>
                  </Choose>
                </If>
              </div>
            </div>
          </div>
        </div>
      </TransitionAppear>
    );
  }

  componentDidMount() {
    logger.debug("componentDidMount()");
    this._mounted = true;
    const session = this.props.session;
    this.interval = setInterval(() => {
      if (this._mounted && session) {
        EchoManager.sendOnCallMessage();
      } else {
        clearInterval(this.interval);
        this.interval = null;
      }
    }, 5000);
    const peerconnection = session.connection;
    const mediaStream = new MediaStream();
    this.mediaStream = mediaStream;
    this.remoteVideo.srcObject = this.mediaStream;
    this.remoteVideo.onpause = () => {
      this.remoteVideo.play();
    };
    // If incoming all we already have the remote stream

    if (session.isEstablished()) {
      setTimeout(() => {
        if (!this._mounted) return;

        this.setState({ canHold: true });
      });
    }

    session.on("progress", (data) => {
      if (!this._mounted) return;

      logger.debug('session "progress" event [data:%o]', data);

      if (session.direction === "outgoing") this.setState({ ringing: true });
    });

    session.on("accepted", (data) => {
      if (!this._mounted) return;

      logger.debug('session "accepted" event [data:%o]', data);

      if (session.direction === "outgoing") {
        this.props.onNotify({
          level: "success",
          title: "Call answered",
        });
      }

      this.setState({ canHold: true, ringing: false });
    });

    session.on("failed", (data) => {
      if (!this._mounted) return;

      logger.debug('session "failed" event [data:%o]', data);

      // this.props.onNotify({
      //   level: "error",
      //   title: "Call failed",
      //   message: `Cause: ${data.cause}`
      // });

      if (session.direction === "outgoing") this.setState({ ringing: false });
    });

    session.on("ended", (data) => {
      if (!this._mounted) return;

      logger.debug('session "ended" event [data:%o]', data);

      // this.props.onNotify({
      //   level: "info",
      //   title: "Call ended",
      //   message: `Cause: ${data.cause}`
      // });

      if (session.direction === "outgoing") this.setState({ ringing: false });
    });

    session.on("hold", (data) => {
      if (!this._mounted) return;

      const originator = data.originator;

      logger.debug('session "hold" event [originator:%s]', originator);

      switch (originator) {
        case "local":
          this.setState({ localHold: true });
          break;
        case "remote":
          this.setState({ remoteHold: true });
          break;
      }
    });

    session.on("unhold", (data) => {
      if (!this._mounted) return;

      const originator = data.originator;

      logger.debug('session "unhold" event [originator:%s]', originator);

      switch (originator) {
        case "local":
          this.setState({ localHold: false });
          break;
        case "remote":
          this.setState({ remoteHold: false });
          break;
      }
    });

    peerconnection.addEventListener("track", (event) => {
      logger.debug('peerconnection "track" event');

      if (!this._mounted) {
        logger.error("_handleRemoteStream() | component not mounted");
        return;
      }
      console.log("streams", event.streams);
      this._handleRemoteStream();
    });
    this._handleRemoteStream();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.debug("componentWillUnmount()");

    const session = this.props.session;
    const end_time = moment(session.end_time);
    const start_time = moment(session.start_time);
    const duration = end_time.diff(start_time, "seconds");
    console.log({ started: this.state.started });
    if (this.state.started) {
      APIManager.callStatus({
        sid: session._id,
        duration,
        direction: session.direction,
        number: session.remote_identity.uri.user,
        did: session.local_identity.uri.user,
      });
    }
    this._mounted = false;
    JsSIP.Utils.closeMediaStream(this._localClonedStream);
  }

  handleHangUp() {
    logger.debug("handleHangUp()");
    this.props.handleHangup(this.props.session._id);
  }

  handleHold() {
    logger.debug("handleHold()");

    this.props.session.hold();
  }

  handleResume() {
    logger.debug("handleResume()");

    this.props.session.unhold();
  }

  _handleRemoteStream() {
    logger.debug("_handleRemoteStream()");
    const session = this.props.session;
    const connection = session.connection;
    if (!connection) {
      console.log("no connection yet");
      return;
    }
    const receivers = connection.getReceivers();
    if (!this.mediaStream) {
      console.log("no mediaStream yet");
      return;
    }
    const mediaStream = this.mediaStream.clone();
    if (!receivers.length) {
      console.log("no connection yet");
      return;
    }
    if (!receivers[0].track) {
      console.log("no track yet");
      return;
    }
    mediaStream.getTracks().forEach((track) => {
      mediaStream.removeTrack(track);
    });
    mediaStream.addTrack(receivers[0].track);
    this.remoteVideo.srcObject = mediaStream;
    this.setState({ mediaStream });
  }

  _checkRemoteVideo(stream) {
    if (!this._mounted) {
      logger.error("_checkRemoteVideo() | component not mounted");
      return;
    }
    const videoTrack = stream.getVideoTracks()[0];
    this.setState({ remoteHasVideo: Boolean(videoTrack) });
  }
}
Session.propTypes = {
  session: PropTypes.object.isRequired,
  onNotify: PropTypes.func.isRequired,
  onHideNotification: PropTypes.func.isRequired,
};

export default connect(null, { fetchRecentCalls })(withStyles(styles)(Session));
