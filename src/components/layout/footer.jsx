import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useSelector, useDispatch } from "react-redux";
import { changeTab } from "../../redux/actionCreators/tabs.actions";
import { DIDHiddenTabs, KEYS } from "../../redux/reducers/tabs";
import { unreadConversationsSelector } from "../../redux/selectors/conversations";
import { Badge } from "@material-ui/core";
import { unreadVoicemailSelector } from "../../redux/selectors/voicemail";
import { didSelector } from "../../redux/selectors/did.selector";
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    bottom: 0,
    position: "fixed",
    width: "100%",
  },
  hidden: {
    display: "none",
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  // const theme = useTheme();
  const tabs = useSelector(({ tabs }) => tabs);
  const mini = useSelector(({ app }) => app.mini);
  const value =
    KEYS.indexOf(tabs.current) != -1 ? KEYS.indexOf(tabs.current) : 1;
  const dispatch = useDispatch();
  const unreadMessages = useSelector(unreadConversationsSelector);
  const unreadVMs = useSelector(unreadVoicemailSelector);
  const sipUser = useSelector(didSelector);
  const getTabLabel = (tab) => {
    if (tab.key === "sms_logs") {
      if (unreadMessages)
        return (
          <Badge badgeContent={unreadMessages} color="primary">
            {tab.label}
          </Badge>
        );
    } else if (tab.key === "voicemail") {
      if (unreadVMs)
        return (
          <Badge badgeContent={unreadVMs} color="primary">
            {tab.label}
          </Badge>
        );
    }
    return tab.label;
  };
  const setValue = (val) => {
    console.log(KEYS[val]);
    dispatch(changeTab(KEYS[val]));
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const showTab = (tab) => {
    if (DIDHiddenTabs.includes(tab.key) && sipUser && !sipUser.caller_id) {
      return false;
    }
    return tab.show;
  };
  if (mini) return null;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabs.all.map((tab, i) => (
            <Tab
              key={tab.key}
              label={getTabLabel(tab)}
              onDragEnter={() => {
                handleChange(null, i);
              }}
              className={!showTab(tab) ? classes.hidden : ""}
              {...a11yProps(tab.key)}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
}
