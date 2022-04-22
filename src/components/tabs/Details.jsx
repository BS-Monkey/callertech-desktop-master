import React, { Component, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import ActionBar from "../ActionBar";
import fetchDemographics from "../../redux/actionCreators/thunk/fetchDemographics";
import utils, { formatNational, getPhoneNumber } from "../../utils";
import Address from "../Address";
import SocialLinks from "../SocialLinks";
import RecentCalls from "../RecentCalls";
import Linkify from "react-linkify";
import Link from "../Link";
import EditDemographics from "../EditDemographics";
import SMSBox from "./SMSBox";
import { LocalParking, Pageview as LookupIcon } from "@material-ui/icons";
import ExpandableTags from "../ExpandableTags";
import {
  callerDetailsAvailableSelector,
  callerDetailsLoadedSelector,
  callerDetailsSelector,
  lookupDataSelector,
} from "../../redux/selectors/details";
import { agentsSelector } from "../../redux/selectors/agents";
import { changeCallNum } from "../../redux/actionCreators/changeCallNum";
import { didSelector } from "../../redux/selectors/did.selector";
import { Avatar } from "../Avatar";
const styles = {
  root: {
    height: "100%",
  },
  namebar: {
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  detailsPanel: {
    padding: 10,
    backgroundColor: "#fafafa",
    minHeight: "calc(100vh - 540px)",
  },
  avatar: {
    width: 200,
    minHeight: 200,
    fontSize: 60,
    marginRight: 10,
  },
  recentCalls: {
    marginTop: 15,
    marginBottom: 15,
  },
  name_wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
};

function ucwords(str) {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}
class Details extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const prevNum = getPhoneNumber(prevProps.lookupData.phonenumber);
    const newNum = getPhoneNumber(this.props.lookupData.phonenumber);
    const typeChanged =
      prevProps.lookupData.type !== this.props.lookupData.type;
    if (newNum && (prevNum != newNum || typeChanged)) {
      console.log(
        "fetching",
        prevProps.phonenumber,
        this.props.lookupData.phonenumber
      );
      this.fetchDemographics();
    }
  }
  componentDidMount() {
    console.log("fetching on mount");
    this.fetchDemographics();
  }

  fetchDemographics(forceFetch = false) {
    let localOnly = this.props.lookupData.type === "no_fetch";
    const fetch = forceFetch || this.props.lookupData.type === "manual";
    if (fetch) {
      localOnly = false;
    }
    if (this.props.loaded || (this.props.available && localOnly)) {
      return;
    }

    let phonenumber = this.props.lookupData.phonenumber;
    console.log(phonenumber);
    const agent = this.props.agents.find(
      (_agent) => _agent.extension == phonenumber.replace("+1", "")
    );
    if (agent) {
      console.log("changecallnum agent");
      phonenumber = getPhoneNumber(agent.phonenumber);
      this.props.changeCallNum(phonenumber, "manual");
    } else {
      this.props.fetchDemographics(phonenumber, fetch, !fetch && localOnly);
    }
  }

  render() {
    const classes = this.props.classes;
    const {
      extraDetails,
      data,
      interests,
      topics,
      employment,
      profiles,
      addresses,
      callerDetails,
      education,
    } = this.props.callerdetails;
    const phonenumber = getPhoneNumber(this.props.lookupData.phonenumber);
    return (
      <div data-attr="test" className={classes.root}>
        <If condition={callerDetails}>
          {this.props.sipUser && this.props.sipUser.caller_id && phonenumber ? (
            <ActionBar phonenumber={phonenumber} />
          ) : null}
          <Grid spacing={2} container>
            <Grid
              item
              xs={12}
              sm={
                (this.props.sipUser && !this.props.sipUser.caller_id) ||
                this.props.lookupData.invalid
                  ? 12
                  : 8
              }
            >
              {/* Left Panel */}
              <Paper className={classes.namebar}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      defaultName={callerDetails.default_name}
                      avatar={callerDetails.avatar}
                      className={classes.avatar}
                    />
                  </Grid>
                  <Grid item xs>
                    <div className={classes.name_wrapper}>
                      <Typography variant="h4">
                        {callerDetails.default_name}
                      </Typography>
                      <div>
                        <If condition={this.props.loaded}>
                          <Tooltip title="Fetch Demographic Data">
                            <IconButton
                              onClick={() => {
                                this.fetchDemographics(true);
                              }}
                            >
                              <LookupIcon />
                            </IconButton>
                          </Tooltip>
                        </If>
                        {phonenumber && this.props.sipUser.caller_id ? (
                          <EditDemographics
                            callerdetails={callerDetails}
                            extra_details={extraDetails}
                            phonenumber={phonenumber}
                          />
                        ) : null}
                      </div>
                    </div>
                    <Typography variant="h5">
                      {callerDetails.nationalFormat}
                    </Typography>
                    {callerDetails.extension ? (
                      <Typography variant="h6">
                        {callerDetails.extension}
                      </Typography>
                    ) : null}
                    {callerDetails.fc_title ? (
                      <Typography variant="h6">
                        {callerDetails.fc_title}{" "}
                        {callerDetails.fc_title && callerDetails.fc_organization
                          ? "at"
                          : ""}{" "}
                        {callerDetails.fc_organization}
                      </Typography>
                    ) : null}

                    {extraDetails && extraDetails.company_name ? (
                      <Typography variant="h6">
                        {extraDetails.company_name}
                      </Typography>
                    ) : callerDetails.company_name ? (
                      <Typography variant="h6">
                        {callerDetails.company_name}
                      </Typography>
                    ) : (
                      ""
                    )}

                    <If condition={callerDetails.fc_website}>
                      <Typography variant="h6">
                        <Link
                          href={
                            callerDetails.fc_website.includes("http")
                              ? callerDetails.fc_website
                              : `http://${callerDetails.fc_website}`
                          }
                        >
                          {callerDetails.fc_website
                            .replace("http://", "")
                            .replace("https://", "")}
                        </Link>
                      </Typography>
                    </If>
                    <If condition={callerDetails.emails}>
                      {callerDetails.emails.map((email, i) => (
                        <Typography key={i} variant="h6">
                          <Link href={"mailto:" + email}>{email}</Link>
                        </Typography>
                      ))}
                    </If>
                    <If condition={extraDetails}>
                      <If condition={extraDetails.website_url}>
                        <Typography variant="h6">
                          <Link href={"mailto:" + extraDetails.website_url}>
                            {extraDetails.website_url}
                          </Link>
                        </Typography>
                      </If>
                      <If condition={extraDetails.misc}>
                        <Typography variant="body2">
                          {extraDetails.misc}
                        </Typography>
                      </If>
                    </If>
                    <If condition={profiles || callerDetails.fb_id}>
                      <SocialLinks
                        profiles={profiles}
                        fbId={callerDetails.fb_id}
                      />
                    </If>
                    <If condition={callerDetails.fc_bio}>
                      {/* <Typography component="div" variant="body1"> */}
                      <Linkify
                        componentDecorator={(
                          decoratedHref,
                          decoratedText,
                          key
                        ) => (
                          <Link href={decoratedHref} key={key}>
                            {decoratedText}
                          </Link>
                        )}
                      >
                        {callerDetails.fc_bio}
                      </Linkify>
                      {/* </Typography> */}
                    </If>
                  </Grid>
                </Grid>
              </Paper>
              <If
                condition={
                  (data && data.length) ||
                  (addresses && addresses.length) ||
                  (interests && interests.length) ||
                  (topics && topics.length) ||
                  (employment && employment.length) ||
                  (profiles && profiles.length) ||
                  (extraDetails && extraDetails.length)
                }
              >
                <Paper className={classes.detailsPanel}>
                  <Grid spacing={3} container>
                    <Grid item xs>
                      <Typography variant="h5">Details</Typography>
                      <If
                        condition={
                          callerDetails.alternate_names &&
                          callerDetails.alternate_names.length
                        }
                      >
                        <b>Alternate Names:</b>
                        {callerDetails.alternate_names.map((name, i) => (
                          <div key={i}>
                            {name} <Divider />
                          </div>
                        ))}
                      </If>
                      <If
                        condition={
                          callerDetails.alternate_phones &&
                          callerDetails.alternate_phones.length
                        }
                      >
                        <b>Alternate Names:</b>
                        {callerDetails.alternate_phones.map((name, i) => (
                          <div key={i}>
                            {formatNational(name)} <Divider />
                          </div>
                        ))}
                      </If>

                      <If condition={data && data.length}>
                        {data.map(({ value, name }) => (
                          <div key={name}>
                            <b>{name}</b>:{" "}
                            <Linkify
                              componentDecorator={(
                                decoratedHref,
                                decoratedText,
                                key
                              ) => (
                                <Link href={decoratedHref} key={key}>
                                  {decoratedText}
                                </Link>
                              )}
                            >
                              {value}
                            </Linkify>
                            <Divider />
                          </div>
                        ))}
                        <If condition={callerDetails.carrier == "prepaid"}>
                          <div>
                            <b>Prepaid: </b> Yes
                          </div>
                        </If>
                        <If condition={callerDetails.business_name != null}>
                          <div>
                            <b>Business Name: </b> {callerDetails.business_name}
                          </div>
                        </If>
                        <If condition={callerDetails.business_industry != null}>
                          <div>
                            <b>Business Industry: </b> {callerDetails.business_industry}
                          </div>
                        </If>
                      </If>
                      <If condition={employment && employment.length}>
                        <Typography variant="h5">Jobs</Typography>
                        {employment.map((row, index) => (
                          <div key={index}>
                            <If condition={row.company_name}>
                              <Typography variant="subtitle1">
                                <b>{row.company_name}</b>
                              </Typography>
                            </If>
                            <If
                              condition={
                                row.socialLinks && row.socialLinks.length
                              }
                            >
                              <SocialLinks
                                profiles={row.socialLinks}
                                fbId={null}
                              />
                            </If>
                            <If condition={row.title}>
                              <Typography variant="body1">
                                <b>Title: </b>
                                {row.title}
                              </Typography>
                            </If>
                            <If condition={row.title_role}>
                              <Typography variant="body1">
                                <b>Title Role: </b>
                                {row.title_role}
                              </Typography>
                            </If>
                            <If condition={row.company_size}>
                              <Typography variant="body1">
                                <b>Company Size: </b>
                                {row.company_size}
                              </Typography>
                            </If>
                            <If condition={row.company_industry}>
                              <Typography variant="body1">
                                <b>Company Industry: </b>
                                {row.company_industry}
                              </Typography>
                            </If>
                            <If condition={row.start || row.end}>
                              <Typography variant="body1">
                                {row.start_date ? row.start_date : ""}
                                {row.start_date && row.end_date ? " - " : ""}
                                {row.end_date ? row.end_date : ""}
                              </Typography>
                            </If>
                            <Divider />
                          </div>
                        ))}
                      </If>
                      <If
                        condition={
                          callerDetails.people && callerDetails.people.length
                        }
                      >
                        <Typography variant="h5">Associated People</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Relation</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {callerDetails.people.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Link
                                    href={`https://google.com/search?q=${encodeURI(
                                      [
                                        row.firstname,
                                        row.middlename,
                                        row.lastname,
                                      ].join(" ")
                                    )}`}
                                  >
                                    {[
                                      row.firstname,
                                      row.middlename,
                                      row.lastname,
                                    ].join(" ")}
                                  </Link>
                                </TableCell>
                                <TableCell>{row.relation}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </If>
                    </Grid>
                    <Grid item xs>
                      <If
                        condition={
                          callerDetails.addresses &&
                          callerDetails.addresses.length
                        }
                      >
                        <Typography variant="h6">Addresses</Typography>
                        {callerDetails.addresses.map((address_id) => (
                          <Address id={address_id} key={address_id} />
                        ))}
                      </If>
                      <If condition={interests && interests.length}>
                        <b>Social Affinities</b>
                        <ExpandableTags
                          list={interests.map((item) => item.name)}
                        ></ExpandableTags>
                      </If>
                      <If condition={topics && topics.length}>
                        <b>Topics</b>
                        <ExpandableTags
                          list={topics.map((item) => item.name)}
                        ></ExpandableTags>
                      </If>
                      <If condition={education && education.length}>
                        <Typography variant="h5">Education</Typography>
                        {education.map((row, index) => (
                          <div key={index}>
                            <If condition={row.school_name}>
                              <Typography variant="subtitle1">
                                <If condition={row.school_website}>
                                  <Link
                                    href={
                                      row.school_website.includes("http")
                                        ? row.school_website
                                        : `http://${row.school_website}`
                                    }
                                  >
                                    <b>{ucwords(row.school_name)}</b>
                                  </Link>
                                </If>
                                <If condition={!row.school_website}>
                                  <b>{ucwords(row.school_name)}</b>
                                </If>
                              </Typography>
                            </If>
                            <If condition={row.degree}>
                              <Typography variant="body1">
                                <b>Degree: </b>
                                {ucwords(row.degree)}
                              </Typography>
                            </If>
                            <If condition={row.majors}>
                              <Typography variant="body1">
                                <b>Majors: </b>
                                {ucwords(row.majors)}
                              </Typography>
                            </If>
                            <If condition={row.minors}>
                              <Typography variant="body1">
                                <b>Minors: </b>
                                {ucwords(row.minors)}
                              </Typography>
                            </If>
                            <If condition={row.gpa}>
                              <Typography variant="body1">
                                <b>GPA: </b>
                                {row.gpa}
                              </Typography>
                            </If>
                            <If condition={row.start_date || row.end_date}>
                              <Typography variant="body1">
                                {row.start_date ? row.start_date : ""}
                                {row.start_date && row.end_date ? " - " : ""}
                                {row.end_date ? row.end_date : ""}
                              </Typography>
                            </If>
                            <Divider />
                          </div>
                        ))}
                      </If>
                    </Grid>
                  </Grid>
                </Paper>
              </If>
            </Grid>
            <If
              condition={
                this.props.sipUser &&
                this.props.sipUser.caller_id &&
                !this.props.lookupData.invalid
              }
            >
              <Grid item xs={12} sm={4}>
                <div className={classes.recentCalls}>
                  <RecentCalls
                    phonenumber={this.props.lookupData.phonenumber}
                  />
                </div>
                <SMSBox phonenumber={this.props.lookupData.phonenumber} />
              </Grid>
            </If>
          </Grid>
        </If>
      </div>
    );
  }
}

let mapStateToProps = (state) => ({
  callerdetails: callerDetailsSelector(state),
  lookupData: lookupDataSelector(state),
  loaded: callerDetailsLoadedSelector(state),
  available: callerDetailsAvailableSelector(state),
  agents: agentsSelector(state),
  sipUser: didSelector(state),
});

export default withStyles(styles)(
  connect(mapStateToProps, { fetchDemographics, changeCallNum })(Details)
);
