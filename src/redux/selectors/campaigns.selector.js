import { createSelector } from "reselect";

export const campaignsStateSelector = (state) => state.campaigns;

export const campaignItemsStateSelector = (state) => state.campaign_items;

export const campaignItemsSelector = createSelector(
  campaignItemsStateSelector,
  (campaignItemsState) => campaignItemsState.data
);
