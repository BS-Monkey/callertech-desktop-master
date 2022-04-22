import React, { Fragment } from "react";
import { makeStyles, Button } from "@material-ui/core";
import { PlayArrow as PlayIcon } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import updateActiveCampaign from "../../redux/actionCreators/updateActiveCampaign";
import AutoDialerControls from "./AutoDialerControls";
const useStyles = makeStyles({
  buttons: {
    marginRight: 10,
  },
});
const AutoDialerToolbar = ({
  phone: { active_campaign, state },
  phone,
  campaign_id,
  handleStart,
}) => {
  const classes = useStyles();
  const isActive = active_campaign;
  const isSelectedActive = campaign_id && active_campaign == campaign_id;
  const isDisabled =
    state != "waiting" || (!isSelectedActive && isActive && campaign_id);
  return (
    <Fragment>
      <If condition={!isSelectedActive && campaign_id}>
        <Button
          className={classes.buttons}
          color="primary"
          size="small"
          variant="contained"
          disabled={isDisabled}
          onClick={() => {
            handleStart();
          }}
          startIcon={<PlayIcon />}
        >
          Start Dialing
        </Button>
        <Button
          className={classes.buttons}
          color="primary"
          size="small"
          variant="contained"
          disabled={isDisabled}
          onClick={() => {
            handleStart(0);
          }}
          startIcon={<PlayIcon />}
        >
          Dial From the Start
        </Button>
      </If>

      <If condition={isActive}>
        <AutoDialerControls phone={phone} campaign_id={campaign_id} />
      </If>
    </Fragment>
  );
};
export default AutoDialerToolbar;
