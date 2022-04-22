import { createSelector } from "reselect";

export const profilePictureStateSelector = (state) => state.profilePicture;

export const profilePictureSelector = createSelector(
  profilePictureStateSelector,
  (state) => state.entities
);
