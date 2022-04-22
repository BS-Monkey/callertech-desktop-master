import moment from "moment";
import { formatNational } from "../utils";

const NormalizeVoicemail = (data) => {
  const ids = [];
  const entities = {};
  data.forEach((voicemail) => {
    ids.push(voicemail.uuid);
    let response = {};
    response.time = moment
      .utc(voicemail.time_created)
      .local()
      .format("h:mm:ss a MMM Do, YYYY");
    response.caller = voicemail.cid_number;
    response.callerFormatted = formatNational(response.caller);
    response.url = `https://api.callertech.net/v2/vml/download/${voicemail.uuid}`;
    response.id = voicemail.uuid;
    response.is_read = !(
      !voicemail.time_read || voicemail.time_read === "1970-01-01 00:00:01"
    );
    entities[response.id] = response;
  });
  return { ids, entities };
};

export default NormalizeVoicemail;
