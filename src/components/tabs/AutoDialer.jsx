import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  makeStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon
} from "@material-ui/core";
import { useEffect } from "react";
import { KEYS } from "../../redux/reducers/tabs";
import fetchCampaigns from "../../redux/actionCreators/thunk/fetchCampaigns";
import moment from "moment";
import CampaignList from "../auto-dialer/CampaignList";
import { PlayArrow, Pause } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    height: "calc(100vh - 156px)"
  },
  sidebar: {
    height: "100%",
    backgroundColor: "#eaeaea",
    overflowY: "auto",
    boxShadow: "rgba(0,0,0,0.5) 1px 0 10px"
  },
  sidebarTitle: {
    textAlign: "center",
    marginTop: 10
  },
  toolbar: {
    padding: 5,
    margin: 10,
    marginBottom: 5,
    backgroundColor: "#ead6c2",
    display: "flex"
  },
  content: {}
});

const AutoDialer = ({ value }) => {
  const campaigns = useSelector(({ campaigns }) => campaigns);
  const phone = useSelector(({ phone }) => phone);
  const [selectedCampaign, setSelectedCampaign] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (value == KEYS.indexOf("autodialer")) dispatch(fetchCampaigns());
  }, [value]);
  useEffect(() => {
    if (campaigns && campaigns.ids.length && !selectedCampaign) {
      setSelectedCampaign(campaigns.ids[0]);
    }
  }, [campaigns]);
  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid className={classes.sidebar} item sm={2}>
        <Typography className={classes.sidebarTitle} variant={"h6"}>
          Campaigns
        </Typography>
        <List component="nav">
          {campaigns.ids.map(campaign_id => (
            <ListItem
              onClick={() => {
                setSelectedCampaign(campaign_id);
              }}
              key={campaigns.data[campaign_id].id}
              selected={campaign_id == selectedCampaign}
              divider={true}
              button
            >
              <If condition={phone.active_campaign == campaign_id}>
                <ListItemIcon>
                  {phone.paused ? <Pause /> : <PlayArrow />}
                </ListItemIcon>
              </If>
              <ListItemText
                primary={campaigns.data[campaign_id].name}
                secondary={moment(
                  campaigns.data[campaign_id].created_at
                ).format("ddd, MMM Do")}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid className={classes.content} item sm={10}>
        <If condition={selectedCampaign}>
          <CampaignList
            phone={phone}
            campaign={campaigns.data[selectedCampaign]}
          />
        </If>
      </Grid>
    </Grid>
  );
};

export default AutoDialer;
