import APIManager from "../../../Managers/APIManager";
import addScheduledCalls from "./../addScheduledCalls";
import removeScheduledCalls from "./../removeScheduledCalls";
import moment from "moment";
import { formatNational } from "../../../utils";
import addNotes from "./../addNotes";

const fetchScheduledCalls = () => (dispatch) => {
  APIManager.getScheduledCalls().then((data) => {
    if (data && data.length) {
      let notes = {};
      data.map((row) => {
        // let returnObj = { ...row };
        let mtime = moment.utc(row.time).local();
        row.formattedTime = mtime.format("h:mm a, MMM Do, YYYY");
        row.time = mtime.toISOString();
        row.formattedNumber = formatNational(row.phonenumber);
        if (row.notes) {
          notes[row.phonenumber] = row.notes;
        }
        return row;
      });
      dispatch(addScheduledCalls(data));
      dispatch(addNotes(notes));
    } else {
      dispatch(removeScheduledCalls());
    }
  });
};
export default fetchScheduledCalls;
