import React, { Component } from "react";
import {
  ButtonGroup,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Notes from "./Notes";
import Flags from "./Flags";
import EmailDemographics from "./EmailDemographics";
import CallButton from "./CallButton";
import HotFileButtons from "./HotFileButtons";
import Scheduler from "./Scheduler";
import AutoDialerControls from "./auto-dialer/AutoDialerControls";
import { connect } from "react-redux";
import DNCButton from "./auto-dialer/DNCButton";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
import APIManager from "../Managers/APIManager";
import DownloadIcon from "@material-ui/icons/CloudDownload";

const styles = {
  actionBar: {
    padding: 5,
    backgroundColor: "#eee",
  },
  btnGroup: {
    backgroundColor: "#fff",
    padding: 2,
  },
};
class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFlag: false,
      openNotes: false,
      openEmail: false,
      notes: "",
    };
  }

  componentDidMount() {
    // this.setState({
    //   notes: this.props.callerdetails.notes || ""
    // });
  }

  async handleExport(phonenumber) {
    const response = await APIManager.exportData(phonenumber);
    if (response) {
      this.props.enqueueSnackbar({
        message: response,
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "success",
        },
      });
    } else {
      this.props.enqueueSnackbar({
        message:
          "There was an error exporting the file. Please try again later.",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
        },
      });
    }
  }

  render() {
    const classes = this.props.classes;
    const phonenumber = this.props.phonenumber;
    const phone = this.props.phone;
    let showDnc = false;
    if (
      phone.active_campaign &&
      phone.active_campaign_items[phone.current_index]
    ) {
      showDnc = true;
    }
    return (
      <Paper className={classes.actionBar}>
        <Grid container justify="space-between" alignItems="center">
          <ButtonGroup
            className={classes.btnGroup}
            variant="contained"
            color="primary"
            size="small"
          >
            <Flags phonenumber={phonenumber} />
            <Notes phonenumber={phonenumber} />
            <EmailDemographics phonenumber={phonenumber} />
            <CallButton phonenumber={phonenumber} />
            <Scheduler
              phonenumber={phonenumber.replace("+1", "")}
              icon={true}
            />
            <Tooltip title="Export all communication with this person">
              <IconButton
                aria-label="Export all communication with this person"
                size="small"
                onClick={() => {
                  this.handleExport(phonenumber);
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <ButtonGroup>
            <AutoDialerControls phone={phone} campaign={null} />
            <If condition={showDnc}>
              <DNCButton phonenumber={phonenumber} />
            </If>
          </ButtonGroup>

          <HotFileButtons phonenumber={phonenumber} />
        </Grid>
      </Paper>
    );
  }
}
export default connect(({ phone }) => ({ phone }), { enqueueSnackbar })(
  withStyles(styles)(ActionBar)
);
