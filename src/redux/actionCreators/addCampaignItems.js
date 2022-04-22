export const ADD_CAMPAIGN_ITEMS = "ADD_CAMPAIGN_ITEMS";
const addCampaignItems = campaigns_items => ({
  type: ADD_CAMPAIGN_ITEMS,
  payload: campaigns_items
});
export default addCampaignItems;
