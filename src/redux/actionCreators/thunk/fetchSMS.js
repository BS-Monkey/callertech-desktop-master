import APIManager from "../../../Managers/APIManager";
import { getPhoneNumber } from "../../../utils";
import moment from "moment";
import NormalizeSMS from "../../../normalizers/NormalizeSMS";
import { groupBy } from "lodash";
import { updateLatestMessageId } from "../updateLatestMessageId";
import { loadMessages } from "../loadMessages";
const fetchSMS =
  (did, phonenumber = null, latestSmsId = 0) =>
  (dispatch) => {
    if (phonenumber) {
      phonenumber = getPhoneNumber(phonenumber);
    }
    did = getPhoneNumber(did);
    APIManager.getSMS(did, phonenumber, latestSmsId).then((data) => {
      dispatch(updateLatestMessageId(data.latest_sms_id));
      const messagesGrouped = groupBy(data.messages, (msg) =>
        msg.direction === "out" ? msg.to : msg.from
      );
      let messages = {};
      const ids = Object.keys(messagesGrouped).filter((key) => key);
      if (ids.length > 1) {
        ids.forEach((phonenumber) => {
          const group = messagesGrouped[phonenumber];
          messages[phonenumber] = NormalizeSMS(group);
        });
        dispatch(loadMessages(messages));
      } else if (ids.length) {
        let phonenumber = ids[0];
        const group = messagesGrouped[phonenumber];
        messages[phonenumber] = NormalizeSMS(group);
        dispatch(loadMessages(messages));
      }
    });
  };
window.moment = moment;
window.fetchSMS = fetchSMS;
export default fetchSMS;
