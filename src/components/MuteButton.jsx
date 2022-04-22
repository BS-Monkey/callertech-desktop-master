import React from "react";
import ReactDOM from "react-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import { VolumeOff, VolumeDown } from "@material-ui/icons";
import { useState } from "react";

const MuteButton = ({ toggleMute, mini = false }) => {
  const [timer, setTimer] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [muted, setMuted] = useState(false);

  const startTimer = () => {
    console.log("started");
    setTimer(
      setTimeout(() => {
        setPressed(true);
        toggleMute(true);
        setMuted(true);
        console.log("mute hold");
      }, 400)
    );
  };

  const handleMouseUp = ev => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    if (pressed) {
      console.log("UNMUTE!!!");
      toggleMute(false);
      setMuted(false);

      setPressed(false);
    } else {
      if (ev) {
        toggleMute(!muted);
        setMuted(!muted);
        console.log("MUTE!!!");
      }
    }
  };

  const children = (
    <div style={{ display: "inline-block" }}>
      <Tooltip title="Hold or Click to Mute Your Mic">
        <span>
          <IconButton
            onMouseDown={startTimer}
            onMouseLeave={() => {
              handleMouseUp(false);
            }}
            size={mini ? "small" : "medium"}
            onMouseUp={handleMouseUp}
            color={muted ? "primary" : "default"}
          >
            {muted ? <VolumeOff /> : <VolumeDown />}
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
  if (mini) {
    return ReactDOM.createPortal(
      <div style={{ display: "inline-block" }}>{children}</div>,
      document.getElementById("mini-controls")
    );
  }
  return <div>{children}</div>;
};
export default MuteButton;
