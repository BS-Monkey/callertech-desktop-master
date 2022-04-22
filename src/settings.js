let base_url;
let hostname;
let fbAppId;
if (window.isDev || !process.env.NODE_ENV) {
  // base_url = "https://callertech.com";
  // hostname = "callertech.com";
  base_url = "http://ct.test";
  hostname = "ct.test";
  fbAppId = "291700144652483";
} else if (process.env.NODE_ENV === "staging") {
  base_url = "https://callerwho.com";
  hostname = "callerwho.com";
} else {
  base_url = "https://callertech.com";
  hostname = "callertech.com";
  fbAppId = "291700144652483";
}

export default {
  base_url,
  hostname,
  socket: {
    uri: "wss://callertech-63dd5e0cccbc.sip.signalwire.com",
    via_transport: "tls",
  },
  registrar_server: "callertech-63dd5e0cccbc.sip.signalwire.com",
  contact_uri: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
    iceCandidatePoolSize: 5,
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  },
  fbAppId,
};
