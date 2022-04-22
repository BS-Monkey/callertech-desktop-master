import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
  FormControl,
  Select,
  Tooltip,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import logout from "../../redux/actionCreators/thunk/logout";
import changePhonenumber from "../../redux/actionCreators/changePhonenumber";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Settings as SettingsIcon, AspectRatio } from "@material-ui/icons";
import Link from "../Link";
import toggleTab from "../../redux/actionCreators/toggleTab";
import changeVoicemail from "../../redux/actionCreators/thunk/changeVoicemail";
import switchMini from "../../redux/actionCreators/switchMini";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    minHeight: 20,
    "-webkit-app-region": "drag",
    " & button, & .MuiSelect-root, & a": {
      "-webkit-app-region": "no-drag",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    width: "auto",
    maxHeight: 35,
  },
  titleMini: {
    width: "auto",
    maxHeight: 20,
  },
  bar: {
    marginLeft: 50,
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 5,
  },
  leftBar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexGrow: 1,
  },
  rightMini: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "end",
  },
  minicontrols: {
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const num = useSelector((state) => state.app.num);
  const mini = useSelector((state) => state.app.mini);
  const sip = useSelector((state) => state.sip.data);
  const phonenumber = sip[num];
  let routingOption;
  if (phonenumber) {
    if (phonenumber.always_voicemail) routingOption = 2;
    else if (!phonenumber.sip_routing) routingOption = 1;
    else routingOption = 0;
  }
  const dispatch = useDispatch();

  const handleChangeRouting = (ev) => {
    const newVal = ev.target.value;
    dispatch(changeVoicemail(phonenumber.caller_id, newVal));
  };

  const handleChange = (e) => {
    dispatch(changePhonenumber(e.target.value));
  };

  const toggleMini = () => {
    if (window.electron) {
      window.electron.ipcRenderer.send(!mini ? "make_mini" : "make_full");
      // if (mini) dispatch(switchMini(!mini));
    }
  };

  const toggleSettings = () => {
    dispatch(toggleTab("settings", true));
  };

  return (
    <div className={classes.root}>
      <AppBar color="default" position="sticky">
        <Toolbar variant="dense" className={classes.root}>
          <Link
            style={{ display: "flex", flexDirection: "row-reverse" }}
            href="https://callertech.com"
          >
            <img
              className={mini ? classes.titleMini : classes.title}
              src={mini ? "./assets/app.png" : "./assets/logo.png"}
              alt="logo"
            />
          </Link>

          <If condition={!mini}>
            <div className={classes.bar}>
              <div className={classes.leftBar}>
                <If condition={phonenumber}>
                  <FormControl>
                    <Select
                      id="phonenumber"
                      value={num}
                      onChange={handleChange}
                    >
                      {sip.map((item, index) => (
                        <MenuItem key={index} value={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </If>
              </div>
              <div className={classes.rightBar}></div>
            </div>
          </If>
          <div id="mini-controls" className={classes.minicontrols}>
            {window.electron ? (
              <IconButton size="small" onClick={toggleMini}>
                <AspectRatio />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={toggleSettings}>
                <SettingsIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
