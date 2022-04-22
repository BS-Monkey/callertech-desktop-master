import React from "react";
import { ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import settings from "../settings";
import sendHotFile from "../redux/actionCreators/thunk/sendHotFile";
import ClickButton from "./ClickButton";
const useStyles = makeStyles({
  btnGroup: {}
});
const HotFileButtons = ({ phonenumber }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const files = useSelector(({ hotfiles }) => hotfiles);
  const num = useSelector(({ app }) => app.num);
  const did = useSelector(({ sip }) => sip.data[num]);

  const sendFile = file => {
    let message = file.text || "";
    if (file.filename) {
      if (message) {
        message += "\n";
      }
      message += `${settings.base_url}/uploads/mms/${encodeURI(file.filename)}`;
    }
    dispatch(sendHotFile(did.caller_id, phonenumber, message));
  };

  return (
    <ButtonGroup
      className={classes.btnGroup}
      variant="contained"
      color="primary"
    >
      {files.map((file, index) => (
        <ClickButton
          key={index}
          data-index={index}
          onClick={() => {
            sendFile(file);
          }}
          phonenumber={phonenumber}
          name={file.shortname.substr(0, 25)}
        />
      ))}
    </ButtonGroup>
  );
};
export default HotFileButtons;
