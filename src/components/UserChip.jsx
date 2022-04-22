import React from "react";
import PropTypes from "prop-types";
import { Chip, Avatar } from "@material-ui/core";
import classnames from "classnames";

export default class UserChip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const name = this.props.name;
    const uri = this.props.uri;
    const status = this.props.status;
    const fullWidth = this.props.fullWidth;

    return (
      <Chip
        data-component="UserChip"
        label="Connection"
        avatar={<Avatar className={classnames("status", status)} />}
        className={classnames({ "full-width": fullWidth })}
      />
    );
  }
}

UserChip.propTypes = {
  name: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired,
  status: PropTypes.string,
  fullWidth: PropTypes.bool
};
