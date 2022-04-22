import Echo from "laravel-echo";
import store from "../redux/store";
import audioPlayer from "./audioPlayer";
import fetchSMS from "../redux/actionCreators/thunk/fetchSMS";
import loginWithOffice from "../redux/actionCreators/loginWithOffice";
import fetchCallLogs from "../redux/actionCreators/thunk/fetchCallLogs";
import Pusher from "pusher-js";
import settings from "../settings";
import Axios from "axios";
import moment from "moment";
import { changeCallNum } from "../redux/actionCreators/changeCallNum";
import { changeTab } from "../redux/actionCreators/tabs.actions";
import fetchVoicemail from "../redux/actionCreators/thunk/fetchVoicemail";
window.axios = Axios;
window.Pusher = Pusher;

export const EVENTS = {
  UPDATE_CALL: "UpdateCallEvent",
  UPDATE_SMS: "UpdateSMSEvent",
  AGENT_UPDATE: "AgentUpdate",
};

class EchoManager {
  constructor() {}

  init(phonenumber, userid, agentid) {
    if (this.echo && this.phonenumber) {
      //already subscribed, so unsubscribe
      this.echo.leaveChannel(this.getDIDChannelName(this.phonenumber));
    }
    if (this.echo && this.userChannel) {
      this.echo.leaveChannel(this.getUserChannelName());
    }

    let conf = {
      broadcaster: "pusher",
      key: "VHyaVllYGOqbKhRo",
      wsHost: settings.hostname,
      wsPort: 6001,
      forceTLS: false,
      wssPort: 6001,
      authEndpoint: `${settings.base_url}/broadcasting/auth`,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
    };
    let userdata = store.getState().userdata;
    if (userdata && userdata.token) {
      conf.auth = {
        headers: { token: userdata.token },
      };
    }
    if (userdata && userdata.token) {
      window.axios.defaults.headers.common["token"] = userdata.token;
    }
    this.echo = new Echo(conf);
    window.echo = this.echo;
    console.log("init");

    this.phonenumber = phonenumber;
    this.userid = userid;
    this.agentid = agentid;
    this.subscribeToDidChannel();
    this.subscribeToUserChannel();
  }

  sendOnCallMessage() {
    if (this.userChannel) {
      this.userChannel.whisper("onCall", {
        agent: this.agentid,
        timestamp: moment.utc().format(),
      });
    }
  }

  sendOffCallMessage() {
    if (this.userChannel) {
      this.userChannel.whisper("offCall", {
        agent: this.agentid,
      });
    }
  }

  subscribeToDidChannel() {
    const channel = this.getDIDChannelName();
    console.log("subscribing to:", channel);
    this.echo
      .channel(channel)
      .listen(EVENTS.UPDATE_CALL, this.handleCall.bind(this))
      .listen(EVENTS.UPDATE_SMS, this.handleSMS.bind(this));
  }

  subscribeToUserChannel() {
    const channel = this.getUserChannelName();
    console.log("subscribing to:", channel);
    this.userChannel = this.echo.private(channel);
    this.userChannel.listen(EVENTS.AGENT_UPDATE, this.handleCall.bind(this));
    this.lastSeenWhisper = setInterval(() => {
      this.userChannel.whisper("lastSeen", {
        agent: this.agentid,
        timestamp: moment.utc().format(),
      });
    }, 5000);
  }

  getDIDChannelName() {
    return `phonenumber.${this.phonenumber.replace("+", "")}`;
  }

  getUserChannelName() {
    return `user.${this.userid}`;
  }

  subscribe(channel) {
    if (!window.Echo) {
      return;
    }
    console.log("subscribing to:", channel);
    window.Echo.private(channel).listen(
      "NewSMSEvent",
      this.handleSMS.bind(this)
    );
  }

  unsubscribe(channel) {
    window.Echo.leaveChannel(channel);
  }

  handleCall() {
    console.log("updating call logs");
    store.dispatch(fetchCallLogs(this.phonenumber));
    store.dispatch(fetchVoicemail(this.phonenumber));
  }

  handleSMS(event) {
    store.dispatch(fetchSMS(event.did, event.phonenumber));
    audioPlayer.play("sms_in");
  }

  subscribeToOutlook(token) {
    if (!window.Echo) {
      return;
    }
    window.Echo.channel(token).listen("OfficeLogin", () => {
      store.dispatch(loginWithOffice());
    });
  }
}

export default new EchoManager();
