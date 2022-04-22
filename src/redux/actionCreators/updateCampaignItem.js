export const UPDATE_CAMPAIGN_ITEM = "UPDATE_CAMPAIGN_ITEM";
const updateCampaignItem = (id, data) => ({
  type: UPDATE_CAMPAIGN_ITEM,
  payload: {
    id,
    data
  }
});
export default updateCampaignItem;
