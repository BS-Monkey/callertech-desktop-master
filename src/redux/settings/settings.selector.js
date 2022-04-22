import { createSelector } from "reselect";

export const settingsSelector = (state) => state.settings;

export const fbAccessTokenSelector = createSelector(
  settingsSelector,
  (userdata) => userdata.accessToken
);

export const userTokenSelector = createSelector(
  settingsSelector,
  (userdata) => userdata.token
);

export const fbLoggedInSelector = createSelector(
  fbAccessTokenSelector,
  (token) => !!token
);

export const userDataSelector = settingsSelector;
