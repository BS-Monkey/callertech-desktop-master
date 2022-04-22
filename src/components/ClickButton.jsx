import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";

const ClickButton = ({ name, onClick, phonenumber, ...props }) => {
  const [status, setStatus] = useState("primary");
  useEffect(() => {
    setStatus("primary");
  }, [phonenumber]);
  return (
    <Button
      {...props}
      variant="contained"
      color={status}
      onClick={() => {
        setStatus("secondary");
        onClick();
      }}
    >
      {name}
    </Button>
  );
};

export default ClickButton;
