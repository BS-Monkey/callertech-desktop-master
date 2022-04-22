import React from "react";
import {
  makeStyles,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  FormControlLabel,
  FormGroup,
  Switch,
  Paper,
  Button,
  Grid,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { Close, AssignmentInd } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import toggleTab from "../../redux/actionCreators/toggleTab";
import ManageHotFiles from "../ManageHotFiles";
import Link from "../Link";
import EchoManager from "../../Managers/EchoManager";
import toggleDemographics from "../../redux/actionCreators/thunk/toggleDemographics";
import Queues from "../Queues";
import { audioSelector } from "../../redux/selectors/audio";
import { changeAudioConstraints } from "../../redux/actionCreators/changeAudioConstriants";
import { fetchSelector } from "../../redux/selectors/did.selector";
import { FBLogin } from "../FBLogin";
import { userTokenSelector } from "../../redux/settings/settings.selector";
import logout from "../../redux/actionCreators/thunk/logout";
import { ManageAutodetection } from "../ManageAutodetection";

const useStyles = makeStyles({
  root: { paddingTop: 10, paddingLeft: 24, paddingRight: 24 },
  marginBottom: { marginBottom: 20 },
  toolbar: {
    padding: "5px 10px",
    background: "#cfcfcf",
    marginBottom: "20px",
  },
  toolbarBtn: {},
  tooltip: {
    marginLeft: "50px",
  },
});
const Settings = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggleTab("settings", false));
  };
  const audioSettings = useSelector(audioSelector);
  const settings = useSelector(({ settings }) => settings);
  const fetch = useSelector(fetchSelector);
  const token = useSelector(userTokenSelector);
  const classes = useStyles();
  const handleChangeDemographics = () => {
    dispatch(toggleDemographics(!fetch));
  };

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      window.location.reload();
    });
  };

  const handleOutlook = () => {
    EchoManager.subscribeToOutlook(btoa(token));
  };

  const handleChangeAudioConstraints = (event) => {
    const newConstraints = {
      [event.target.name]: event.target.checked,
    };
    console.log("changing audio constraints", newConstraints);
    dispatch(changeAudioConstraints(newConstraints));
  };

  return (
    <div>
      <AppBar color="default" position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClose}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Paper className={classes.toolbar}>
          <Grid container justify="space-between" alignItems="center">
            <Queues />
            <ManageHotFiles />
            <ManageAutodetection />
            <Button
              component={Link}
              onClick={handleOutlook}
              href={`https://callertech.com/login/office?token=${btoa(token)}`}
              variant={"contained"}
              color={"default"}
            >
              Connect to Microsoft Office Calendar
            </Button>
            <Button
              onClick={handleLogout}
              variant={"contained"}
              color={"default"}
            >
              Logout
            </Button>
          </Grid>
        </Paper>

        {/* <InputMask
          mask="(999) 999-9999"
          value={forwardingNum}
          onChange={e => {
            setForwardingNum(e.target.value);
          }}
          className={classes.marginBottom}
          onBlur={handleChangeForwarding}
        >
          {inputProps => (
            <TextField {...inputProps} label="Forwarding Number"></TextField>
          )}
        </InputMask> */}
        <div className={classes.marginBottom}></div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Mic Settings</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={audioSettings.echoCancellation}
                    onChange={handleChangeAudioConstraints}
                    name="echoCancellation"
                  />
                }
                label="Echo Cancellation"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={audioSettings.autoGainControl}
                    onChange={handleChangeAudioConstraints}
                    name="autoGainControl"
                  />
                }
                label="Audio Gain Control"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={audioSettings.noiseSuppression}
                    onChange={handleChangeAudioConstraints}
                    name="noiseSuppression"
                  />
                }
                label="Noise Suppression"
              />
            </FormGroup>
            <FormGroup className={classes.marginBottom}>
              <FormLabel component="legend">
                User Data Lookup Settings
              </FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!fetch}
                    onChange={handleChangeDemographics}
                  />
                }
                label="Turn on Automatic Demographic Lookups For Incoming &
                    Outgoing Calls"
              />
              <Typography
                className={classes.tooltip}
                color="initial"
                variant="overline"
              >
                Manual Lookups Can Still Be Performed By Pushing The{" "}
                <AssignmentInd style={{ marginBottom: "-5px" }} /> Lookup Icon.
              </Typography>
            </FormGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default Settings;
