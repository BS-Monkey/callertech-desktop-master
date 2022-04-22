import { createSelector } from "reselect";

export const settingsSelector = (state) => state.settings;

export const demographicsSettingsSelector = createSelector(
  settingsSelector,
  (settings) => settings.demographics
);
