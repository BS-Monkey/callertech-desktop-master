export const MAKE_VOICEMAIL_READ = "MAKE_VOICEMAIL_READ";

const makeVoicemailRead = sid => {
  return {
    type: MAKE_VOICEMAIL_READ,
    payload: sid
  };
};
export default makeVoicemailRead;
