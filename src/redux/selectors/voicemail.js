import { createSelector } from "reselect";

const voicemailSelector = (state) => state.voicemail;

export const voicemailLoadedSelector = createSelector(
  voicemailSelector,
  (voicemails) => voicemails.loaded
);
export const allVoicemailSelector = createSelector(
  voicemailSelector,
  ({ ids, entities }) => ids.map((id) => entities[id])
);

export const unreadVoicemailSelector = createSelector(
  allVoicemailSelector,
  (voicemails) => voicemails.filter((vm) => !vm.is_read).length
);
