import { CHANGE_SIP } from "../actionCreators/changeSIP";
import { RESET_SIP } from "../actionCreators/resetSIP";
import { SWITCH_DEMOGRAPHICS } from "../actionCreators/switchDemographics";

const DEFAULT_STATE = {
  fetched: false,
  data: [],
};
export default function sip(state = DEFAULT_STATE, action) {
  if (action.type == CHANGE_SIP) {
    return { fetched: true, ...action.payload };
  }
  if (action.type === RESET_SIP) {
    return DEFAULT_STATE;
  }
  if (action.type === SWITCH_DEMOGRAPHICS) {
    const data = state.data.map((item) => ({ ...item, fetch: action.payload }));
    return { ...state, data };
  }
  return state;
}
