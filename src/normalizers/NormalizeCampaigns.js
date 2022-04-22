import { schema, normalize } from "normalizr";

const NormalizeCampaigns = data => {
  const campaign_items = new schema.Entity("campaign_items", {});
  const campaign = new schema.Entity("campaign", {
    items: [campaign_items]
  });
  const normalizedCampaigns = normalize(data, [campaign]);
  return {
    campaigns: {
      ids: normalizedCampaigns.result,
      data: normalizedCampaigns.entities.campaign
    },
    campaign_items: {
      ids: Object.keys(normalizedCampaigns.entities.campaign_items),
      data: normalizedCampaigns.entities.campaign_items
    }
  };
  //   return {

  //   }
  //   return {
  //     callerdetails: normalizedCallerdata.entities.callerdata,
  //     flags: normalizedCallerdata.entities.flags,
  //     notes: normalizedCallerdata.entities.notes,
  //     emails: normalizedCallerdata.entities.email,
  //     address: normalizedCallerdata.entities.address
  //   };
};

export default NormalizeCampaigns;
