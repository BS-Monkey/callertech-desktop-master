import { ADD_CAMPAIGN_ITEMS } from "../actionCreators/addCampaignItems";
import { RESET_CAMGAIGN } from "../actionCreators/resetCampaign";
import updateCampaignItem, {
  UPDATE_CAMPAIGN_ITEM,
} from "../actionCreators/updateCampaignItem";

const defaultState = {
  ids: [],
  data: {
    // "1": {
    //   phonenumber: "+16782495172",
    //   first_name: "Ayanna",
    //   last_name: "Blanding",
    //   city: "Atlanta"
    // }
  },
};
const campaign_items = (state = defaultState, action) => {
  if (action.type == ADD_CAMPAIGN_ITEMS) {
    if (!action.payload) return defaultState;
    return action.payload;
  }
  if (action.type == UPDATE_CAMPAIGN_ITEM) {
    console.log("UPDATE_CAMPAIGN_ITEM");
    let item = state.data[action.payload.id];
    if (item) {
      item = { ...item, ...action.payload.data };
      console.log({ [action.payload.id]: item });
      return {
        ids: state.ids,
        data: { ...state.data, [action.payload.id]: item },
      };
    }
  }
  if (action.type === RESET_CAMGAIGN) {
    return defaultState;
  }
  return state;
};
window.updateCampaignItem = updateCampaignItem;
export default campaign_items;
