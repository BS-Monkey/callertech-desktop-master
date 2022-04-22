import { CHANGE_TAB, TOGGLE_TAB } from "../actionCreators/tabs.actions";
export const KEYS = [
  "call_logs",
  "sms_logs",
  "details",
  "voicemail",
  "schedule",
  "autodialer",
  "settings",
];
export const DIDHiddenTabs = [
  "call_logs",
  "sms_logs",
  "schedule",
  "autodialer",
];

const defaultState = {
  all: [
    {
      label: "Calls",
      key: KEYS[0],
      show: true,
    },

    {
      label: "Messages",
      key: KEYS[1],
      show: true,
    },
    {
      label: "Details",
      key: KEYS[2],
      show: true,
    },
    {
      label: "Voicemail",
      key: KEYS[3],
      show: true,
    },
    {
      label: "Scheduled Calls",
      key: KEYS[4],
      show: true,
    },
    {
      label: "Marketing Dialer",
      key: KEYS[5],
      show: true,
    },
    {
      label: "Settings",
      key: KEYS[6],
      show: false,
    },
  ],
  current: "details",
};
const tabs = (state = defaultState, action) => {
  if (action.type == CHANGE_TAB) {
    return { ...state, current: action.payload };
  }
  if (action.type == TOGGLE_TAB) {
    let current = state.current;
    let all = state.all.map((tab) => {
      //if the tab is shown, then change current to it
      if (action.payload.show) {
        current = action.payload.key;
      } else {
        //if the tab is hidden, then change the current to details
        if (current == action.payload.key) current = "details";
      }

      if (tab.key == action.payload.key) {
        tab.show = action.payload.show;
      }
      return tab;
    });

    return { all, current };
  }
  return state;
};

export default tabs;
