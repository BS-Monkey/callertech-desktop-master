import APIManager from "../../../Managers/APIManager";
import NormalizeCampaigns from "../../../normalizers/NormalizeCampaigns";
import addCampaigns from "../addCampaigns";
import addCampaignItems from "../addCampaignItems";

const fetchCampaigns = () => dispatch => {
  APIManager.getCampaigns().then(response => {
    if (response.status != "success") return;
    if (response.data && response.data.length) {
      const normalizedData = NormalizeCampaigns(response.data);
      dispatch(addCampaigns(normalizedData.campaigns));
      dispatch(addCampaignItems(normalizedData.campaign_items));
    } else {
      dispatch(addCampaigns(null));
      dispatch(addCampaignItems(null));
    }
  });
};
window.fetchCampaigns = fetchCampaigns;

export default fetchCampaigns;
