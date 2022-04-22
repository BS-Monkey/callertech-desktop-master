import React from "react";
import { connect } from "react-redux";
import { Paper, IconButton, InputBase } from "@material-ui/core";
import { Save as SaveIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import addEmail from "../redux/actionCreators/addEmail";
import APIManager from "../Managers/APIManager";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
const styles = {
  root: {
    padding: "3px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
  },
  iconButton: {
    padding: 5,
  },
};

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      email: "",
    };
  }

  componentDidMount() {
    if (this.props.email) {
      this.setState({
        email: this.props.email.email || "",
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.email != this.props.email) {
      this.setState({
        email: this.props.email ? this.props.email.email : "",
      });
    }
  }

  handleChange(e) {
    this.setState({ email: e.target.value });
  }

  handleSave(e) {
    e.preventDefault();
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
      APIManager.saveEmail(this.props.phonenumber, this.state.email).then(
        (success) => {
          if (success) {
            this.props.addEmail({
              [this.props.phonenumber]: { email: this.state.email },
            });
            this.props.enqueueSnackbar({
              message: "Email has been saved.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "success",
              },
            });
          } else
            this.props.enqueueSnackbar({
              message: "Email couldn't be saved. Please try again.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "warning",
              },
            });
        }
      );
    } else {
      this.props.enqueueSnackbar({
        message: "Please enter a valid email address.",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
        },
      });
    }
    return false;
  }

  render() {
    const classes = this.props.classes;
    return (
      <div>
        <form action="" onSubmit={this.handleSave.bind(this)}>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Save Email"
              inputProps={{ "aria-label": "Save Email" }}
              value={this.state.email}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <IconButton
              type="submit"
              aria-label="Save"
              className={classes.iconButton}
              onClick={this.handleSave.bind(this)}
            >
              <SaveIcon />
            </IconButton>
          </Paper>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  email: state.email[ownProps.phonenumber],
});
export default connect(mapStateToProps, { addEmail, enqueueSnackbar })(
  withStyles(styles)(Email)
);
