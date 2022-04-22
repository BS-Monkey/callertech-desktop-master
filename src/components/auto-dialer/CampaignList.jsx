import React from "react";
import { Typography, withStyles, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import VirtualizedTable from "./VirtualizedTable";
import updateActiveCampaign from "../../redux/actionCreators/updateActiveCampaign";
import { changeTab } from "../../redux/actionCreators/tabs.actions";
import { changeCallNum } from "../../redux/actionCreators/changeCallNum";
import AutoDialerToolbar from "./AutoDialerToolbar";
import _ from "lodash";
import { campaignItemsSelector } from "../../redux/selectors/campaigns.selector";
const styles = {
  root: {
    height: "100%",
  },
  wrapper: {
    height: "calc(100% - 60px)",
    boxSizing: "border-box",
    padding: 5,
    paddingTop: 10,
  },
  topBar: {
    padding: 5,
    margin: 10,
    marginBottom: 5,
    backgroundColor: "#faece6",
  },
  content: { height: "100%" },
};
class CampaignList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_index: 0,
      item_ids: [],
      start_from: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const phone = this.props.phone;
    const campaign = this.props.campaign;
    if (
      campaign.id != prevProps.campaign.id ||
      phone.current_index != prevProps.phone.current_index ||
      phone.active_campaign != prevProps.phone.active_campaign ||
      this.props.campaign_items != prevProps.campaign_items
    ) {
      this.updateRows();
    }
  }
  componentDidMount() {
    const interval = setInterval(() => {
      if (
        this.props.campaign_items &&
        Object.keys(this.props.campaign_items).length
      ) {
        this.updateRows();
        clearInterval(interval);
      }
    }, 100);
  }

  updateRows() {
    const phone = this.props.phone;
    let sort_assist = [];
    this.props.campaign.items.map((i) => {
      sort_assist.push({
        id: i,
        calls_made: this.props.campaign_items[i].calls_made || 0,
        calls_attended: this.props.campaign_items[i].calls_attended || 0,
      });
      return this.props.campaign_items[i];
    });
    sort_assist = _.orderBy(
      sort_assist,
      ["calls_attended", "calls_made"],
      ["desc", "desc"]
    );
    let smallest_index = 0;
    let smallest_count = 99999;
    let sorted_item_ids = sort_assist.map((item, index) => {
      if (item.calls_made < smallest_count) {
        smallest_index = index;
        smallest_count = item.calls_made;
      }
      return item.id;
    });
    let newState = {
      item_ids: sorted_item_ids,
      start_from: smallest_index,
    };
    if (phone.active_campaign == this.props.campaign.id) {
      const active_item_id = phone.active_campaign_items[phone.current_index];
      const current_index = this.state.item_ids.indexOf(active_item_id);
      if (current_index !== -1) {
        newState.current_index = current_index;
      }
    } else {
      newState.current_index = newState.start_from;
    }
    this.setState(newState);
  }

  handleStart(startFrom = null) {
    let changes = {
      active_campaign: this.props.campaign.id,
      paused: false,
      current_index: this.state.start_from,
      active_campaign_items: this.state.item_ids,
    };
    if (startFrom !== null) {
      changes.current_index = startFrom;
    }
    console.log("changes:", { changes });
    this.props.dispatch(updateActiveCampaign(changes));
  }

  updateActiveCampaign(data) {
    this.props.updateActiveCampaign(data);
  }

  showDetails(phonenumber) {
    this.props.dispatch(changeCallNum(phonenumber, "manual"));
    this.props.dispatch(changeTab("details"));
  }

  render() {
    const { classes, campaign, phone } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.topBar}>
          <AutoDialerToolbar
            item_ids={this.state.item_ids}
            phone={phone}
            handleStart={this.handleStart.bind(this)}
            campaign_id={campaign.id}
          />
        </Paper>
        {this.renderList()}
      </div>
    );
  }

  renderList() {
    if (!this.state.item_ids) {
      return <div></div>;
    }
    if (!this.state.item_ids.length) {
      return <Typography variant="body1">No Items Found</Typography>;
    }
    const getter = ({ index }) => {
      return this.props.campaign_items[this.state.item_ids[index]];
    };
    const { classes, campaign, phone } = this.props;
    const callCall = !phone.active_campaign; // && this.props.phone.state == "waiting";
    return (
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <VirtualizedTable
            rowCount={this.state.item_ids.length}
            rowGetter={getter}
            callCall={callCall}
            isActive={this.props.phone.active_campaign == campaign.id}
            currentIndex={this.state.current_index}
            startFrom={this.state.start_from}
            handleStart={this.handleStart.bind(this)}
            showDetails={(phonenumber) => {
              this.showDetails(phonenumber);
            }}
            columns={[
              {
                width: 200,
                label: "Person",
                flexShrink: 1,
                dataKey: "phonenumber",
              },
              {
                width: 400,
                label: "Additional Details",
                dataKey: "extra_details",
                flexGrow: 1,
              },
              {
                width: 100,
                flexShrink: 1,
                label: "Dialed",
                dataKey: "calls_made",
              },
              {
                width: 100,
                label: "Attended",
                flexShrink: 1,
                dataKey: "calls_attended",
              },
              {
                label: "Actions",
                dataKey: "actions",
                flexShrink: 1,
                width: 220,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  campaign_items: campaignItemsSelector(state),
  phone: state.phone,
});
export default connect(mapStateToProps)(withStyles(styles)(CampaignList));
