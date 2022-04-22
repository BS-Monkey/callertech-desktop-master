import React, { useState, useEffect } from "react";
import { Chip } from "@material-ui/core";
const Timer = ({ stop }) => {
  const [sec, setSec] = useState(0);
  const interval = setInterval(() => {
    // const nextSec = sec+1;
    setSec(sec + 1);
  }, 1000);
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });
  return <Chip label={sec} />;
};
export default Timer;
