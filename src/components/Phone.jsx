import React from "react";
import PropTypes from "prop-types";
import JsSIP from "jssip";
import Logger from "../Managers/Logger";
import audioPlayer from "../Managers/audioPlayer";
import TransitionAppear from "./TransitionAppear";
import Dialer from "./Dialer";
import Session from "./Session";
import Incoming from "./Incoming";
import APIManager from "../Managers/APIManager";
import NotificationManager from "../Managers/NotificationManager";
import settings from "../settings";
import { isEqual as isObjectEqual } from "lodash";
import {
  Toolbar,
  Chip,
  AppBar,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { changeCallNum } from "../redux/actionCreators/changeCallNum";
import { connect } from "react-redux";
import { formatNational } from "../utils";
import UpcomingCalls from "./UpcomingCalls";
import updateActiveCampaign from "../redux/actionCreators/updateActiveCampaign";
import MuteButton from "./MuteButton";
import AgentsButton from "./AgentsButton";
import { Loop, CallMerge } from "@material-ui/icons";
import EchoManager from "../Managers/EchoManager";
import { audioConstraintsSelector } from "../redux/selectors/audio";
import { changeAudioConstraints } from "../redux/actionCreators/changeAudioConstriants";
import { agentFromExtension, agentsSelector } from "../redux/selectors/agents";
window.audioPlayer = audioPlayer;
const logger = new Logger("Phone");
const styles = {
  root: {
    padding: 5,
    backgroundColor: "#eee",
  },
  wrapper: {
    display: "flex",
    alignContent: "space-around",
    minHeight: 50,
  },
  wrapperMini: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    minHeight: 50,
    height: "100%",
  },
  miniPhone: {
    height: "calc(100vh - 48px)",
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  content: {
    flexGrow: 1,
    maxHeight: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  online: {
    backgroundColor: "#34CF58",
  },
  offline: {
    backgroundColor: "#DF2C2E",
  },
  rightTabbar: {
    width: 440,
  },
  rightTabbarMini: {
    width: 170,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  UpcomingCalls: {
    float: "left",
    display: "flex",
    alignItems: "center",
  },
  callSeperator: {
    width: "5px",
    height: "100%",
    borderLeft: "2px #222 solid",
  },
  multipleCallControls: {
    width: "50px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderLeft: "2px #222 solid",
    borderRight: "2px #222 solid",
  },
};
class Phone extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // 'connecting' / disconnected' / 'connected' / 'registered'
      status: "disconnected",
      sessions: [],
      active_session: null,
      incomingSession: null,
      callState: null,
      sessionOnHold: null,
    };

    // Mounted flag
    this._mounted = false;
    // JsSIP.UA instance
    this._ua = null;
    this.settings = settings;
  }

  render() {
    const state = this.state;
    const props = this.props;
    const classes = this.props.classes;

    window.logger = logger;
    return (
      <TransitionAppear duration={1000}>
        <AppBar
          color="default"
          position="static"
          // className={classes.root}
          className={props.mini ? classes.miniPhone : classes.root}
          data-component="Phone"
        >
          <Toolbar
            className={props.mini ? classes.wrapperMini : classes.wrapper}
            // className={classes.wrapper}
            variant="dense"
          >
            <div className={classes.content}>
              <If condition={state.sessions[0]}>
                <Session
                  incomingSession={state.incomingSession}
                  session={state.sessions[0]}
                  key={state.sessions[0]._id}
                  active={state.sessions[0]._id === this.state.active_session}
                  session_count={state.sessions.length}
                  handleHangup={this.handleHangup.bind(this)}
                  onNotify={props.onNotify}
                  mini={props.mini}
                  state={state.callState}
                  onHideNotification={props.onHideNotification}
                />
              </If>
              <If condition={state.sessions[1]}>
                <div className={classes.multipleCallControls}>
                  <Tooltip title="Switch Calls">
                    <IconButton onClick={this.handleToggle.bind(this)}>
                      <Loop />
                    </IconButton>
                  </Tooltip>
                  <If condition={props.conference.fetched}>
                    <Tooltip title="Merge Calls">
                      <IconButton onClick={this.handleMerge.bind(this)}>
                        <CallMerge />
                      </IconButton>
                    </Tooltip>
                  </If>
                </div>
              </If>
              <If condition={state.sessions[1]}>
                <Session
                  incomingSession={state.incomingSession}
                  session={state.sessions[1]}
                  key={state.sessions[1]._id}
                  active={state.sessions[1]._id === this.state.active_session}
                  session_count={state.sessions.length}
                  handleHangup={this.handleHangup.bind(this)}
                  onNotify={props.onNotify}
                  mini={props.mini}
                  state={state.callState}
                  onHideNotification={props.onHideNotification}
                />
              </If>
              <If condition={state.sessions.length && state.incomingSession}>
                <div className={classes.callSeperator}></div>
              </If>
              <If condition={state.incomingSession}>
                <Incoming
                  incomingSession={state.incomingSession}
                  onAnswer={this.handleAnswerIncoming.bind(this)}
                  mini={this.props.mini}
                  onReject={this.handleRejectIncoming.bind(this)}
                />
              </If>
              <If condition={!state.sessions.length && !state.incomingSession}>
                {props.mini ? null : (
                  <Chip
                    label="Connection"
                    className={
                      this.state.status == "registered"
                        ? classes.online
                        : classes.offline
                    }
                  />
                )}
              </If>
            </div>
            <div
              className={
                props.mini ? classes.rightTabbarMini : classes.rightTabbar
              }
            >
              <div className={classes.UpcomingCalls}>
                <If condition={!props.mini}>
                  <UpcomingCalls />
                  <AgentsButton
                    session={state.sessions.length || !!state.incomingSession}
                    onCall={this.handleOutgoingCall.bind(this)}
                    onTransfer={this.handleTransfer.bind(this)}
                  />
                </If>
                <If
                  condition={
                    this.state.sessions.length || this.state.incomingSession
                  }
                >
                  <MuteButton
                    mini={props.mini}
                    toggleMute={this.changeMute.bind(this)}
                  />
                </If>
              </div>
              <div className={classes.dialer}>
                <Dialer
                  settings={settings}
                  status={state.status}
                  sessions={this.state.sessions}
                  handleAnswerCall={this.handleAnswerIncoming.bind(this)}
                  incomingSession={this.state.incomingSession}
                  busy={Boolean(state.sessions.length || state.incomingSession)}
                  callme={settings.TO}
                  caller_number={this.state.number}
                  onInput={this.handleKeypadInput.bind(this)}
                  onCall={this.handleOutgoingCall.bind(this)}
                />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </TransitionAppear>
    );
  }

  componentDidMount() {
    this._mounted = true;
    this.setupSIP();
    this.checkConstraints();
  }

  checkConstraints() {
    console.log("Phone:checkConstraints");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: this.props.audioConstraints,
        })
        .then((mediaStream) => {
          const tracks = mediaStream.getTracks();
          if (tracks.length) {
            const constraints = tracks[0].getConstraints();
            console.log({ constraints });
            changeAudioConstraints(constraints);
          }
          resolve();
        })
        .catch((reason) => reject(reason));
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sip.username != this.props.sip.username) {
      this.setupSIP();
    }

    if (
      !isObjectEqual(this.props.audioConstraints, prevProps.audioConstraints)
    ) {
      this.updateMediaConstraints();
    }
  }

  updateMediaConstraints() {
    if (this.state.sessions) {
      console.log("sessions", this.state.sessions);
      this.state.sessions.forEach((session) => {
        console.log("session", session);
        const senders = session.connection.getSenders();
        console.log("senders", senders);
        senders.forEach((sender) => {
          console.log("track", sender.track);
          sender.track.applyConstraints(this.props.audioConstraints);
        });
      });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getActiveSession() {
    if (!this.state.active_session) {
      return null;
    }
    return this.state.sessions.find(
      (session) => session._id === this.state.active_session
    );
  }

  sendDTMF(input) {
    const session = this.getActiveSession();
    audioPlayer.playDMTF(input);
    if (session) session.sendDTMF(input);
  }

  changeMute(mute = false) {
    if (!mute) {
      this.getActiveSession().unmute();
    } else {
      this.getActiveSession().mute();
    }
  }

  handleKeypadInput(input) {
    const session = this.getActiveSession();
    if (session) {
      this.sendDTMF(input);
      return false;
    } else {
      return true;
    }
  }

  handleNewCaller(num, type) {
    if (num.length < 5) {
      const agent = agentFromExtension(num.replace("+", ""), this.props.agents);
      if (agent) {
        this.props.changeCallNum(agent.phonenumber, type);
      }
    } else {
      this.props.changeCallNum(num.replace("+1", ""), type);
    }
  }

  handleTransfer(extension) {
    console.log("transferring to ", extension);
    this.getActiveSession().refer(extension);
  }

  handleToggle() {
    const activeSession = this.getActiveSession();
    const otherSessions = this.state.sessions.filter(
      (session) => session._id !== this.state.active_session
    );
    activeSession.hold();
    otherSessions[0].unhold();
    this.setState({
      active_session: otherSessions[0]._id,
      sessions: [activeSession, ...otherSessions],
    });
    if (otherSessions[0]) {
      window.session = otherSessions[0];
      this.handleNewCaller(otherSessions[0].remote_identity.uri._user);
    }
  }

  handleMerge() {
    const activeSession = this.getActiveSession();
    const otherSessions = this.state.sessions.filter(
      (session) => session._id !== this.state.active_session
    );
    const conference = this.props.conference;
    if (!conference || !conference.fetched || !conference.data.extension) {
      return;
    }
    activeSession.refer(conference.data.extension);
    otherSessions[0].refer(conference.data.extension);
    setTimeout(() => {
      this.handleOutgoingCall(conference.data.extension);
    }, 500);
  }

  resumeOtherCall(active_session) {
    const otherSessions = this.state.sessions.filter(
      (session) => session._id !== active_session
    );
    console.log({ otherSessions });
    if (otherSessions.length) {
      otherSessions[0].unhold();
    }
    this.setState({
      sessions: otherSessions,
    });
    if (otherSessions[0]) {
      this.handleNewCaller(otherSessions[0].remote_identity.uri._user);
    }
  }

  handleHangup(_id) {
    EchoManager.sendOffCallMessage();
    const session = this.state.sessions.find((session) => session._id === _id);
    if (!session) {
      return;
    }
    session.terminate();
  }

  handleOutgoingCall(uri) {
    audioPlayer.stop("waiting");
    logger.debug('handleOutgoingCall() [uri:"%s"]', uri);
    this.setState({
      callState: null,
    });
    const outCallHandlers = {
      icecandidate: (e) => {
        setTimeout(() => {
          e.ready();
        }, 200);
      },
      connecting: (e) => {
        if (this.state.sessions.length) {
          this.state.sessions.forEach((session) => session.hold());
        }
        this.setState({
          sessions: [...this.state.sessions, session],
          active_session: session._id,
        });
        NotificationManager.send(
          "Outgoing call",
          "Calling " + formatNational(uri)
        );
        EchoManager.sendOnCallMessage();
        this.props.updateActiveCampaign({
          state: "connecting",
          phonenumber: uri,
          direction: "out",
        });
        this.handleNewCaller(uri, "out");
      },
      sending: (e) => {
        // try {
        //   let uri = new JsSIP.URI("sip", sip.caller_id, sip.registrar_server);
        //   let header = new JsSIP.NameAddrHeader(uri, "", null);
        //   //displays the correct From header just fine
        // } catch (e) {
        //   console.error(e);
        // }
        //here's where I want to modify the INVITE request
        // e.request.headers.From[0] = header;
      },

      progress: () => {
        this.props.updateActiveCampaign({ state: "ringing" });
        audioPlayer.play("ringback");
      },

      failed: () => {
        console.log("failed");
        audioPlayer.stop("ringing");
        audioPlayer.stop("ringback");
        audioPlayer.stop("waiting");
        this.resumeOtherCall(session._id);
        EchoManager.sendOffCallMessage();
        if (this.state.sessions.length === 1) {
          this.props.updateActiveCampaign({
            state: "waiting",
            direction: "",
            phonenumber: "",
          });
        }
        if (this.settings.To) {
          window.close();
        }
      },

      ended: () => {
        audioPlayer.stop("ringing");
        audioPlayer.stop("ringback");
        audioPlayer.stop("waiting");
        if (this.state.sessions.length === 1) {
          this.props.updateActiveCampaign({
            state: "waiting",
            direction: "",
            phonenumber: "",
          });
        }
        this.resumeOtherCall(session._id);
        EchoManager.sendOffCallMessage();
        if (this.settings.To) {
          window.close();
        }
      },

      accepted: () => {
        audioPlayer.stop("ringback");
        audioPlayer.play("answered");
        this.setState({
          callState: true,
        });
        this.props.updateActiveCampaign({ state: "connected" });
      },
    };
    let formattedNumber = uri;
    if (uri.length > 9) {
      formattedNumber = `1${uri}`;
    }
    console.log("calling");
    const session = this._ua.call(formattedNumber, {
      pcConfig: this.settings.pcConfig || { iceServers: [] },
      sessionTimersExpires: 500,
      eventHandlers: outCallHandlers,
      mediaConstraints: {
        audio: this.props.audioConstraints,
        video: false,
      },
      rtcOfferConstraints: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: false,
      },
    });
  }

  handleAnswerIncoming() {
    EchoManager.sendOnCallMessage();
    logger.debug("handleAnswerIncoming()");
    audioPlayer.stop("waiting");
    const session = this.state.incomingSession;
    session.on("icecandidate", (e) => {
      setTimeout(() => {
        e.ready();
      }, 200);
    });
    session.answer({
      pcConfig: this.settings.pcConfig || { iceServers: [] },
      mediaConstraints: {
        audio: this.props.audioConstraints,
        video: false,
      },
    });
  }

  handleRejectIncoming() {
    logger.debug("handleRejectIncoming()");
    audioPlayer.stop("waiting");
    audioPlayer.stop("ringing");

    const session = this.state.incomingSession;

    session.terminate();
  }

  handleNewSession(data) {
    if (!this._mounted) return;

    if (data.originator === "local") return;

    logger.debug('UA "newRTCSession" event');

    const state = this.state;
    const session = data.session;
    // console.log(session);
    // Avoid if busy or other incoming
    if (state.incomingSession || state.sessions.length > 1) {
      logger.debug('incoming call replied with 486 "Busy Here"');
      session.terminate({
        status_code: 486,
        reason_phrase: "Busy Here",
      });
      return;
    }
    if (state.sessions.length) {
      audioPlayer.playLooped("waiting");
    } else {
      console.log("playing ringing");
      audioPlayer.playLooped("ringing");
    }
    NotificationManager.send(
      "Incoming Call From",
      formatNational(session._request.from._uri._user)
    );
    this.setState({
      incomingSession: session,
      number: session._request.from._uri._user,
    });

    this.handleNewCaller(session._request.from._uri._user, "in");
    this.props.updateActiveCampaign({
      state: "ringing",
      direction: "in",
      phonenumber: session._request.from._uri._user,
      paused: true,
    });

    session.on("failed", () => {
      console.log("rtc failed");
      audioPlayer.stop("waiting");
      audioPlayer.stop("ringing");
      EchoManager.sendOnCallMessage();
      if (this.state.sessions.length === 1) {
        this.props.updateActiveCampaign({
          state: "waiting",
          direction: "",
          phonenumber: "",
        });
      }
      if (this.state.incomingSession._id === session._id) {
        this.setState({
          incomingSession: null,
        });
      } else {
        this.resumeOtherCall(session._id);
      }
    });

    session.on("ended", () => {
      console.log("rtc ended");
      audioPlayer.stop("waiting");
      if (this.state.sessions.length === 1) {
        this.props.updateActiveCampaign({
          state: "waiting",
          direction: "",
          phonenumber: "",
        });
      }
      this.resumeOtherCall(session._id);
      EchoManager.sendOffCallMessage();
    });
    session.on("accepted", () => {
      console.log("RTC accepted");

      audioPlayer.stop("waiting");
      audioPlayer.stop("ringing");

      if (this.state.sessions.length) {
        this.state.sessions.forEach((session) => session.hold());
      }
      this.setState({
        sessions: [...this.state.sessions, session],
        active_session: session._id,
        incomingSession: null,
        callState: true,
      });
      this.props.updateActiveCampaign({ state: "connected" });
    });
  }

  setupSIP() {
    const sip = this.props.sip;

    let sipConf = {
      uri: `${sip.username}@${settings.registrar_server}`,
      password: sip.password,
      authorization_user: sip.username,
      display_name: sip.name,
    };

    if (sip.url) {
      sipConf = {
        ...sipConf,
        uri: `sip:${sip.username}@${sip.url}`,
        authorization_user: sip.username,
        registrar_server: sip.url,
        contact_uri: `sip:${sip.username}@${sip.url}`,
        socket: {
          uri: `wss://sip.callertech.net:8443`,
          via_transport: "wss",
        },
      };
    }
    const sipSettings = { ...settings, ...sipConf };
    console.log(sipSettings);
    const socket = new JsSIP.WebSocketInterface(sipSettings.socket.uri);

    if (sipSettings.socket["via_transport"] !== "auto")
      socket["via_transport"] = sipSettings.socket["via_transport"];
    try {
      this._ua = new JsSIP.UA({
        uri: sipSettings.uri,
        password: sipSettings.password,
        display_name: sipSettings.display_name,
        sockets: [socket],
        registrar_server: sipSettings.registrar_server,
        contact_uri: sipSettings.contact_uri,
        authorization_user: sipSettings.authorization_user,
        instance_id: sipSettings.instance_id,
        session_timers: sipSettings.session_timers,
        use_preloaded_route: sipSettings.use_preloaded_route,
      });
    } catch (error) {
      console.log(error);
      this.props.onNotify({
        level: "error",
        title: "Wrong JsSIP.UA settings",
        message: error.message,
      });

      this.props.onExit();

      return;
    }

    this._ua.on("connecting", () => {
      if (!this._mounted) return;

      logger.debug('UA "connecting" event');

      this.setState({
        uri: this._ua.configuration.uri.toString(),
        status: "connecting",
      });
    });

    this._ua.on("connected", () => {
      if (!this._mounted) return;
      logger.debug('UA "connected" event');
      this.props.updateActiveCampaign({ state: "waiting" });
      this.setState({ status: "connected" });
    });

    this._ua.on("disconnected", () => {
      if (!this._mounted) return;

      logger.debug('UA "disconnected" event');
      this.props.updateActiveCampaign({ state: "disconnected" });

      this.setState({ status: "disconnected" });
    });

    this._ua.on("registered", () => {
      if (!this._mounted) return;

      logger.debug('UA "registered" event');
      this.props.updateActiveCampaign({ state: "waiting" });

      this.setState({ status: "registered" });
    });

    this._ua.on("unregistered", () => {
      if (!this._mounted) return;

      logger.debug('UA "unregistered" event');
      this.props.updateActiveCampaign({ state: "disconnected" });

      if (this._ua.isConnected()) this.setState({ status: "connected" });
      else this.setState({ status: "disconnected" });
    });

    this._ua.on("registrationFailed", (data) => {
      if (!this._mounted) return;

      logger.debug('UA "registrationFailed" event');
      console.log(console.log("registration failed: ", data));
      this.props.updateActiveCampaign({ state: "disconnected" });

      if (this._ua.isConnected()) {
        this.setState({ status: "connected" });
      } else {
        this.setState({ status: "disconnected" });
      }
      this.props.onNotify({
        level: "error",
        title: "Registration failed",
        message: data.cause,
      });
    });

    this._ua.on("newRTCSession", this.handleNewSession.bind(this));

    this._ua.start();
  }
}

Phone.propTypes = {
  onNotify: PropTypes.func.isRequired,
  onHideNotification: PropTypes.func.isRequired,
  onShowSnackbar: PropTypes.func.isRequired,
  onHideSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  mini: state.app.mini,
  conference: state.conference,
  audioConstraints: audioConstraintsSelector(state),
  agents: agentsSelector(state),
});

export default connect(mapStateToProps, {
  // export default connect(null, {
  changeCallNum,
  changeAudioConstraints,
  updateActiveCampaign,
})(withStyles(styles)(Phone));
