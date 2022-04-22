import React, { Fragment } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import VirtualizedTable from "./VirtualizedTable";
import { useCallback } from "react";
import updateActiveCampaign from "../redux/actionCreators/updateActiveCampaign";
import { changeTab } from "../redux/actionCreators/tabs.actions";
import { changeCallNum } from "../redux/actionCreators/changeCallNum";
const styles = {
  root: {
    height: "calc(100% - 60px)",
    boxSizing: "border-box",
    padding: 5,
    paddingTop: 10,
  },
  topBar: { padding: 5 },
  content: { height: "100%" },
};
class CampaignList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.campaign.id != prevProps.campaign.id ||
      this.props.phone.current_index != prevProps.phone.current_index
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
    }, 50);
  }

  updateRows() {
    this.setState({
      rows: this.props.campaign.items.map((i) => this.props.campaign_items[i]),
    });
  }

  updateActiveCampaign(data) {
    this.props.updateActiveCampaign(data);
  }

  showDetails(phonenumber) {
    this.props.dispatch(changeCallNum(phonenumber, "manual"));
    this.props.dispatch(changeTab("details"));
  }

  render() {
    if (!this.state.rows) {
      return <div></div>;
    }
    if (!this.state.rows.length) {
      return <Typography variant="body1">No Items Found</Typography>;
    }
    const classes = this.props.classes;
    const getter = ({ index }) => {
      return this.state.rows[index];
    };
    const callCall = !this.props.phone.active_campaign; // && this.props.phone.state == "waiting";

    const campaign = this.props.campaign;
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <VirtualizedTable
            rowCount={this.state.rows.length}
            rowGetter={getter}
            callCall={callCall}
            isActive={this.props.phone.active_campaign == campaign.id}
            currentIndex={this.props.phone.current_index}
            updateActiveCampaign={(data) => {
              this.props.dispatch(updateActiveCampaign(data));
            }}
            showDetails={(phonenumber) => {
              this.showDetails(phonenumber);
            }}
            columns={[
              {
                width: 200,
                label: "Phone Number",
                dataKey: "phonenumber",
              },
              {
                width: 200,
                label: "First Name",
                dataKey: "first_name",
              },
              {
                width: 200,
                label: "Last Name",
                dataKey: "last_name",
              },
              {
                width: 100,
                label: "Dialed Calls",
                dataKey: "calls_made",
              },
              {
                width: 100,
                label: "Calls Attended",
                dataKey: "calls_attended",
              },
              {
                label: "Actions",
                dataKey: "actions",
                flexGrow: 1,
                width: 200,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  campaign_items: state.campaign_items.data,
});
export default connect(mapStateToProps)(withStyles(styles)(CampaignList));
