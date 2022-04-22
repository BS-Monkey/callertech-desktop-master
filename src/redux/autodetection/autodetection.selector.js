import { createSelector } from "reselect";

export const autodetectionSelector = (state) => state.autodetection;

export const autodetectionMessagesSelector = createSelector(
  autodetectionSelector,
  ({ ids, entities }) => {
    return ids.map((id) => entities[id]);
  }
);

export const autodetectionLoadedSelector = createSelector(
  autodetectionSelector,
  ({ loaded }) => loaded
);
