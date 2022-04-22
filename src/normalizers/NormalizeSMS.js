import moment from "moment";
import { randomString } from "../utils";

const NormalizeSMS = (data) => {
  let messages = [];
  if (!data) return [];
  data.forEach((message) => {
    let temp = {};
    temp.position = message.direction == "out" ? "right" : "left";
    temp.date = moment.utc(message.datetime).local().toISOString();
    temp.name = message.name;
    temp.id = message.id;
    temp.otherAvatar = message.avatar;
    temp.is_read = message.is_read;
    if (message.message) {
      temp.type = "text";
      temp.text = message.message;
      messages.push(temp);
    }
    if (message.mms_num_files > 0) {
      for (let i = 0; i < message.mms_num_files; i++) {
        temp = { ...temp };
        temp.text = null;
        temp.id = randomString(10);
        let media_urls = message.media_urls[i];
        if (!media_urls) continue;
        let uri = message.media_urls[i].mediaUrl;
        let mime = message.media_urls[i].mediaType;
        let name = uri.substring(uri.lastIndexOf("/") + 1);
        if (mime && mime.includes("image")) {
          temp.type = "photo";
        } else if (mime && mime.includes("video")) {
          temp.type = "video";
        } else {
          temp.text = name.replace(/[0-9]*/, "");
          temp.type = "file";
        }
        if (!uri) continue;
        temp.data = { uri, status: { download: true } };
        messages.push(temp);
      }
    }
  });
  return messages.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? 1 : -1
  );
};
export default NormalizeSMS;
