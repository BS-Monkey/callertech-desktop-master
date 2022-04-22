export const CHANGE_SIP = "CHANGE_SIP";
export default function changeSIP(sip) {
  return { type: CHANGE_SIP, payload: sip };
}
