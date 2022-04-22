import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import APIManager from "../Managers/APIManager";
import addFlag from "../redux/actionCreators/addFlag";
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
export default function Flags({ phonenumber }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const savedFlag = useSelector(state => state.flags[phonenumber] || {});
  const flagTypes = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "grey"
  ];
  const dispatch = useDispatch();
  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSave = type => {
    APIManager.saveFlags(phonenumber, type).then(success => {
      if (success) dispatch(addFlag({ [phonenumber]: { type } }));
      handleClose();
    });
  };
  return (
    <Fragment>
      <Tooltip title="Flags">
        <IconButton
          style={{ color: savedFlag.type }}
          onClick={handleClick}
          aria-label="Notes regarding this person."
          size="small"
        >
          <FlagIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {flagTypes.map(type => (
          <MenuItem
            key={type}
            data-type={type}
            onClick={() => {
              handleSave(type);
            }}
          >
            <FlagIcon style={{ color: type }} /> {type}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
}
