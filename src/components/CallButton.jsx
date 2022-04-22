import React, { useState } from "react";
import { useDispatch } from "react-redux";
import makeCall from "../redux/actionCreators/makeCall";
import { IconButton, Tooltip } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import { changeTab } from "../redux/actionCreators/tabs.actions";
export default function CallButton({ phonenumber }) {
  const dispatch = useDispatch();
  const handleClick = () => {
    // setStatus("secondary");
    dispatch(changeTab("details"));
    dispatch(makeCall(phonenumber.replace("+1", "")));
  };
  const [status, setStatus] = useState("primary");
  return (
    <Tooltip title="Call">
      <IconButton
        color={status}
        onClick={handleClick}
        aria-label="Call this person."
        size="small"
      >
        <CallIcon />
      </IconButton>
    </Tooltip>
  );
}
