export const ADD_VOICEMAIL = "ADD_VOICEMAIL";

const addVoicemail = voicemail => {
  return {
    type: ADD_VOICEMAIL,
    payload: voicemail
  };
};
export default addVoicemail;
