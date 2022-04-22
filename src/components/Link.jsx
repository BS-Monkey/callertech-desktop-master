/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
const electron = window.electron;

const Link = props => {
  const { children, onClick, ...other } = props;

  const handleClick = e => {
    if (electron) {
      e.preventDefault();
      electron.shell.openExternal(props.href);
    }
    if (onClick) {
      onClick();
    }
  };
  return (
    <a
      style={{ textDecoration: "none", color: "#3215a4" }}
      onClick={handleClick}
      {...other}
    >
      {children}
    </a>
  );
};

export default Link;
