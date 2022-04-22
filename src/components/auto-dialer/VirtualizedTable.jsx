import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import { formatNational } from "../../utils";
import CallButton from "../CallButton";
import Notes from "../Notes";
import Scheduler from "../Scheduler";
import { IconButton, Tooltip } from "@material-ui/core";
import { PlayArrow, AssignmentInd } from "@material-ui/icons";
import DNCButton from "./DNCButton";

const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  cell: {
    height: 40,
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0px !important" : undefined,
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
  extra_div: {
    maxHeight: "40px",
    overflowX: "hidden",
  },
  extra_span: {
    marginRight: 7,
  },
  selected: {
    backgroundColor: "#cb6700 !important",
    color: "#fff",
  },
  called: {
    backgroundColor: "#f4cfcf",
  },
  done: {
    backgroundColor: "#e4ffe2",
  },
  hidden: {
    opacity: 0,
    height: 40,
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrolltoIndex: 0,
      mounted: false,
    };
  }
  componentDidMount() {
    this.setState({ mounted: true });
    this.scrolltoIndex();
  }
  componentWillUnmount() {
    this.setState({ mounted: false });
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.currentIndex != this.props.currentIndex ||
      prevProps.isActive != this.props.isActive
    ) {
      this.scrolltoIndex();
    }
  }

  scrolltoIndex = () => {
    if (!this.state.mounted) return;
    let resetState = 0;
    if (this.props.currentIndex == 0 && this.props.rowCount > 0) {
      resetState = 1;
    }
    this.setState({
      scrolltoIndex: resetState,
    });
    setTimeout(() => {
      this.setState({
        scrolltoIndex: this.props.currentIndex,
      });
    }, 200);
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex, rowIndex, rowData, dataKey }) => {
    const {
      columns,
      classes,
      rowHeight,
      onRowClick,
      isActive,
      currentIndex,
      startFrom,
    } = this.props;
    const classNames = clsx(classes.tableCell, classes.flexContainer, {
      [classes.called]: rowData.calls_attended == 0 && rowData.calls_made > 0,
      [classes.done]: rowData.calls_attended > 0,
      [classes.selected]:
        (isActive && currentIndex == rowIndex) ||
        (!isActive && startFrom == rowIndex),
    });
    if (dataKey == "extra_details") {
      try {
        cellData = JSON.parse(cellData);
        if (!cellData) cellData = {};
      } catch (e) {
        cellData = {};
      }
      if (rowData.email) {
        cellData.email = rowData.email;
      }
    }
    return (
      <TableCell
        component="div"
        className={classNames}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        <Choose>
          <When condition={dataKey == "actions"}>
            <span className={classes.cell}>
              <If condition={!rowData.dnc}>
                <Tooltip
                  title={
                    this.props.callCall
                      ? "Start dialing From Here"
                      : "Stop active dialer first."
                  }
                >
                  <span>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        this.props.handleStart(rowIndex);
                      }}
                      disabled={!this.props.callCall}
                      aria-label="Call this person."
                      size="small"
                    >
                      <PlayArrow />
                    </IconButton>
                  </span>
                </Tooltip>
                <CallButton phonenumber={rowData.phonenumber} />
                <Scheduler phonenumber={rowData.phonenumber} icon />

                <Tooltip title="Show Details">
                  <IconButton
                    onClick={() => {
                      this.props.showDetails(rowData.phonenumber);
                    }}
                    size="small"
                  >
                    <AssignmentInd />
                  </IconButton>
                </Tooltip>
              </If>
              <DNCButton
                icon
                dnc={rowData.dnc}
                phonenumber={rowData.phonenumber}
              />
            </span>
          </When>
          <When condition={columnIndex == 0}>
            <Fragment>
              {formatNational(cellData)} <br />
              {rowData.first_name} {rowData.last_name}
            </Fragment>
          </When>
          <When condition={dataKey == "extra_details"}>
            <If condition={!Object.keys(cellData).length}>
              <span className={classes.hidden}>&nbsp;</span>
            </If>
            <div className={classes.extra_div}>
              {Object.keys(cellData).map((key) => (
                <span className={classes.extra_span} key={key}>
                  <b>{key}:</b> {cellData[key]}
                </span>
              ))}
            </div>
          </When>
          <When condition={!cellData}>
            <span className={classes.hidden}>&nbsp;</span>
          </When>
          <Otherwise>
            <span className={classes.cell}>{cellData}</span>
          </Otherwise>
        </Choose>
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight = 70,
      headerHeight = 48,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            currentIndex={
              this.props.isActive
                ? this.props.currentIndex
                : this.props.startFrom
            }
            scrollToIndex={this.state.scrolltoIndex}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, flexGrow, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  flexGrow={flexGrow}
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  currentIndex={this.props.currentIndex}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
export default VirtualizedTable;
