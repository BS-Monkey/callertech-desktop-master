export const UPDATE_ACTIVE_CAMPAIGN = "UPDATE_ACTIVE_CAMPAIGN";
const updateActiveCampaign = payload => ({
  type: UPDATE_ACTIVE_CAMPAIGN,
  payload
});
window.updateActiveCampaign = updateActiveCampaign;
export default updateActiveCampaign;
