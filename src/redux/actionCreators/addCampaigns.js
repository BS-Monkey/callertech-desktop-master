export const ADD_CAMPAIGNS = "ADD_CAMPAIGNS";
const addCampaigns = campaigns => ({
  type: ADD_CAMPAIGNS,
  payload: campaigns
});
export default addCampaigns;
