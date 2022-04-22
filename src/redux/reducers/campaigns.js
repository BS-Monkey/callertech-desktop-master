import { ADD_CAMPAIGNS } from "../actionCreators/addCampaigns";
import { RESET_CAMGAIGN } from "../actionCreators/resetCampaign";

const defaultState = {
  ids: [],
  data: {
    // "1": {
    //     "id": 1,
    //     "name": "testing",
    //     "items": [1,5]
    // }
  },
};
const campaigns = (state = defaultState, action) => {
  if (action.type == ADD_CAMPAIGNS) {
    if (!action.payload) return defaultState;
    return action.payload;
  }
  if (action.type === RESET_CAMGAIGN) {
    return defaultState;
  }
  return state;
};

export default campaigns;
