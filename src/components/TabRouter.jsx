import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTab } from "../redux/actionCreators/tabs.actions";
import { Typography, Box } from "@material-ui/core";
import CallLogs from "./tabs/CallLogs";
import SMSLogs from "./tabs/SMSLogs";
import Contacts from "./tabs/Contacts";
import Details from "./tabs/Details";
import Settings from "./tabs/Settings";
import { KEYS } from "../redux/reducers/tabs";
import Voicemail from "./tabs/Voicemail";
import ScheduledCalls from "./tabs/ScheduledCalls";
import AutoDialer from "./tabs/AutoDialer";
import { callerPhonenumberSelector } from "../redux/selectors/details";
import { didSelector } from "../redux/selectors/did.selector";
import { Fragment } from "react";
const TabPanel = ({ children, value, index, other, styles }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      <Box style={styles}>{children}</Box>
    </Typography>
  );
};

const TabRouter = () => {
  const currentKey = useSelector(({ tabs }) => tabs.current);
  const lookupPhonenumber = useSelector(callerPhonenumberSelector);
  const sipUser = useSelector(didSelector);
  const mini = useSelector(({ app }) => app.mini);
  console.log({ sipUser });
  const value = KEYS.indexOf(currentKey);
  if (mini) return null;
  return (
    <div
      style={{
        paddingTop: 0,
        height: "calc(100% - 145px)",
        overflowX: "auto",
      }}
    >
      {sipUser && sipUser.caller_id ? (
        <Fragment>
          <TabPanel
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: "10px !important",
            }}
            value={value}
            index={0}
          >
            <CallLogs value={value} />
          </TabPanel>
          <TabPanel
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: "10px !important",
            }}
            value={value}
            index={1}
          >
            <SMSLogs value={value} />
          </TabPanel>
        </Fragment>
      ) : null}
      <TabPanel
        styles={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
        }}
        value={value}
        index={2}
      >
        <If condition={lookupPhonenumber}>
          <Details />
        </If>
      </TabPanel>
      <TabPanel styles={{}} value={value} index={3}>
        <Voicemail value={value} />
      </TabPanel>
      {sipUser && sipUser.caller_id ? (
        <Fragment>
          <TabPanel styles={{}} value={value} index={4}>
            <ScheduledCalls value={value} />
          </TabPanel>
          <TabPanel styles={{}} value={value} index={5}>
            <AutoDialer value={value} />
          </TabPanel>{" "}
        </Fragment>
      ) : null}
      <TabPanel styles={{}} value={value} index={6}>
        <Settings />
      </TabPanel>
    </div>
  );
};

export default TabRouter;
