import APIManager from "../../../Managers/APIManager";
import NormalizeCalls from "../../../normalizers/NormalizeCalls";
import { addCall } from "../addCall";
import addRecording from "../addRecording";
import addRecentCalls from "../addRecentCalls";
import Utils from "../../../utils";

const fetchRecentCalls = (did, remote) => (dispatch) => {
  did = Utils.getPhoneNumber(did);
  remote = Utils.getPhoneNumber(remote);
  APIManager.recentCalls(did, remote).then((calls) => {
    if (
      calls &&
      calls.status == "success" &&
      calls.data &&
      calls.data.count > 0
    ) {
      const normalizedCalls = NormalizeCalls(calls.data.calls);
      console.log({ normalizedCalls });
      dispatch(addCall(normalizedCalls.calls));
      dispatch(addRecording(normalizedCalls.recordings));
      dispatch(addRecentCalls(remote, normalizedCalls.call_sids));
    }
  });
};
window.fetchRecentCalls = fetchRecentCalls;
export default fetchRecentCalls;
