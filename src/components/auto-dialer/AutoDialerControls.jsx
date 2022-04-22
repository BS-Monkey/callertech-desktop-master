import React, { Fragment } from "react";
import { makeStyles, Button } from "@material-ui/core";
import {
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow
} from "@material-ui/icons";
import { useDispatch } from "react-redux";
import updateActiveCampaign from "../../redux/actionCreators/updateActiveCampaign";
import DNCButton from "./DNCButton";
const useStyles = makeStyles({
  buttons: {
    marginRight: 10
  }
});
const AutoDialerControls = ({
  phone: { active_campaign, paused, state },
  campaign_id
}) => {
  const classes = useStyles();
  const isActive = active_campaign;
  const isSelectedActive = campaign_id && active_campaign == campaign_id;
  const isDisabled =
    state != "waiting" || (!isSelectedActive && isActive && campaign_id);
  const dispatch = useDispatch();
  const handleStop = () => {
    dispatch(
      updateActiveCampaign({
        active_campaign: null,
        paused: true,
        active_campaign_items: [],
        current_index: 0
      })
    );
  };
  const handlePause = () => {
    dispatch(
      updateActiveCampaign({
        paused: !paused
      })
    );
  };
  return (
    <Fragment>
      <If condition={isActive}>
        <Button
          className={classes.buttons}
          color="primary"
          size="small"
          variant="contained"
          disabled={isDisabled && !isActive}
          onClick={handleStop}
          startIcon={<StopIcon />}
        >
          Stop Auto-dial
        </Button>
        <Button
          className={classes.buttons}
          color="primary"
          size="small"
          variant="contained"
          disabled={isDisabled && !isActive}
          onClick={handlePause}
          startIcon={paused ? <PlayArrow /> : <PauseIcon />}
        >
          {paused ? "Resume Auto-dial" : "Pause Auto-dial"}
        </Button>
      </If>
    </Fragment>
  );
};
export default AutoDialerControls;
