import React, { Fragment } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Phone from "./components/Phone";
import Notifier from "./components/Notifier";
import { Snackbar } from "@material-ui/core";
import TabRouter from "./components/TabRouter";
import { connect } from "react-redux";
import fetchPhoneNumbers from "./redux/actionCreators/thunk/fetchPhoneNumbers";
import logout from "./redux/actionCreators/thunk/logout";
import showAlert from "./redux/actionCreators/showAlert";
import changeLoading from "./redux/actionCreators/changeLoading";
import Alert from "./components/Alert";
import fetchHotFiles from "./redux/actionCreators/thunk/fetchHotFiles";
import Notification from "./components/Notification";
import fetchSMS from "./redux/actionCreators/thunk/fetchSMS";
import EchoManager from "./Managers/EchoManager";
import { fetchAgents } from "./redux/actionCreators/thunk/fetchAgents";
import fetchVoicemail from "./redux/actionCreators/thunk/fetchVoicemail";
import { fetchConference } from "./redux/actionCreators/thunk/fetchConference";
import { fetchAutodetections } from "./redux/autodetection/autodetection.thunk";
window.io = require("socket.io-client");

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.Notifier = {};
    this.state = {
      showSnackbar: false,
      snackbarMessage: "",
      backgroundInterval: null,
    };
  }
  componentDidMount() {
    this.props.changeLoading(true);
    this.props.fetchPhoneNumbers();
    this.props.fetchHotFiles();
    this.props.fetchAutodetections();

    const sip = this.props.sip;
    if (sip.data[this.props.num]) {
      this.initAppForDid(sip.data[this.props.num]);
    }
  }

  componentDidUpdate(prevProps) {
    const sip = this.props.sip;
    if (sip.fetched && !sip.count) {
      showAlert("Your account has no compatible phone numbers.");
    }
    if (
      this.props.sip.count != prevProps.sip.count ||
      this.props.num != prevProps.num
    ) {
      if (sip.data[this.props.num]) {
        this.initAppForDid(sip.data[this.props.num]);
      }
    }
  }

  initAppForDid(sipData) {
    if (sipData.caller_id) {
      EchoManager.init(sipData.caller_id, sipData.userid, sipData.agentid);
    }
    if (this.state.backgroundInterval) {
      this.setState({ backgroundInterval: null });
    }
    this.fetchBackgroundResources(sipData.caller_id);
    this.setState({
      backgroundInterval: setInterval(
        () => this.fetchBackgroundResources(sipData.caller_id),
        60 * 1000
      ),
    });
  }

  fetchBackgroundResources(callerId) {
    if (callerId) {
      this.props.fetchSMS(callerId);
    }
    this.props.fetchAgents();
    this.props.fetchVoicemail();
  }

  handleLogout() {
    this.setState({ backgroundInterval: null });
    this.props.logout();
  }

  handleNotify(data) {
    if (this.props.mini) return;

    this.Notifier.notify(data);
  }

  handleHideNotification(uid) {
    this.Notifier.hideNotification(uid);
  }

  handleShowSnackbar(message, duration) {
    if (this.props.mini) return;
    clearTimeout(this._snackbarTimer);

    this.setState({
      showSnackbar: true,
      snackbarMessage: message,
    });

    if (duration) {
      this._snackbarTimer = setTimeout(() => {
        if (!this._mounted) return;

        this.setState({ showSnackbar: false });
      }, duration);
    }
  }

  handleHideSnackbar() {
    clearTimeout(this._snackbarTimer);

    this.setState({
      showSnackbar: false,
    });
  }

  render() {
    window.handleNotify = this.handleNotify.bind(this);
    const state = this.state;
    const sip = this.props.sip;
    return (
      <Fragment>
        {/* <If condition={this.props.mini}> */}
        <Notification />
        <Notifier
          ref={(r) => {
            this.Notifier = r;
          }}
        />
        {/* </If> */}
        <Header />
        <If condition={sip && sip.fetched && sip.count}>
          <Phone
            onNotify={this.handleNotify.bind(this)}
            onHideNotification={this.handleHideNotification.bind(this)}
            onShowSnackbar={this.handleShowSnackbar.bind(this)}
            onHideSnackbar={this.handleHideSnackbar.bind(this)}
            sip={sip.data[this.props.num]}
            onExit={(r) => r}
          />
        </If>
        <If condition={sip.fetched && !sip.count}>
          <Alert
            open={sip.fetched && !sip.count}
            message={
              "This accout has no compatible phone numbers. You will be logged out."
            }
            closeHandler={this.handleLogout.bind(this)}
          />
        </If>
        <TabRouter />
        <Footer />
        <Snackbar
          open={state.showSnackbar}
          message={state.snackbarMessage || ""}
          bodyStyle={{ textAlign: "center" }}
          onRequestClose={() => {}} // Avoid auto-hide on click away
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sip: state.sip,
    num: state.app.num || 0,
    mini: state.app.mini,
  };
};

export default connect(mapStateToProps, {
  fetchPhoneNumbers,
  logout,
  changeLoading,
  fetchHotFiles,
  fetchAutodetections,
  fetchSMS,
  fetchAgents,
  fetchVoicemail,
  fetchConference,
})(Home);
