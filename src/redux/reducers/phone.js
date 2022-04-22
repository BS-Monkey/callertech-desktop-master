import { MAKE_CALL } from "../actionCreators/makeCall";
import { UPDATE_ACTIVE_CAMPAIGN } from "../actionCreators/updateActiveCampaign";

const defaultState = {
  phonenumber: "",
  state: "disconnected", //"disconnected/waiting/ringing/connected/hold",
  direction: "",
  callme: "", //MAKE_CALL
  active_campaign: null, //UPDATE_ACTIVE_CAMPAIGN
  current_index: 0, //UPDATE_ACTIVE_CAMPAIGN, NEXT_CALL
  active_campaign_items: [],
  paused: true //UPDATE_ACTIVE_CAMPAIGN
};

const phone = (state = defaultState, action) => {
  if (action.type == MAKE_CALL) {
    return { ...state, callme: action.payload };
  }
  if (action.type == UPDATE_ACTIVE_CAMPAIGN) {
    return { ...state, ...action.payload };
  }
  if (action.type == MAKE_CALL) {
    return { ...state, callme: action.payload };
  }
  return state;
};

export default phone;
