import { createSelector } from "reselect";
import { appSelector } from "./app.selector";

const sipSelector = (state) => state.sip;

export const didFetchedSelector = createSelector(
  sipSelector,
  (sip) => sip.fetched
);

export const didSelector = createSelector(
  sipSelector,
  appSelector,
  didFetchedSelector,
  (sip, app, fetched) => (fetched ? sip.data[app.num] : null)
);

export const internalOnlySelector = createSelector(
  didSelector,
  (user) => !user.caller_id
);

export const fetchSelector = createSelector(
  didSelector,
  (did) => did && did.fetch
);
