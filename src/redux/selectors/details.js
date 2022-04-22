import { createSelector } from "reselect";
import { formatNational, getPhoneNumber } from "../../utils";
import { agentsSelector, agentStateSelector } from "./agents";

export const formatCallerDetails = (
  callerDetails,
  extraDetails,
  agent = null
) => {
  let interests, topics;
  try {
    if (callerDetails.fc_details_interests) {
      interests = JSON.parse(callerDetails.fc_details_interests);
    }
    if (callerDetails.fc_details_topics) {
      topics = JSON.parse(callerDetails.fc_details_topics);
    }
  } catch (e) {
    console.log(e);
  }
  let employment = [];
  if (callerDetails.fc_details_employment) {
    const jobs = JSON.parse(callerDetails.fc_details_employment);
    if (jobs) {
      employment = jobs.map((job) => {
        const socialLinks = [];
        if (job.company_linkedin) {
          socialLinks.push({
            service: "linkedin",
            url: job.company_linkedin,
          });
        }
        if (job.company_facebook) {
          socialLinks.push({
            service: "facebook",
            url: job.company_facebook,
          });
        }
        if (job.company_twitter) {
          socialLinks.push({
            service: "twitter",
            url: job.company_twitter,
          });
        }
        job.socialLinks = socialLinks;
        return job;
      });
    }
  }
  const education = callerDetails.fc_details_education
    ? JSON.parse(callerDetails.fc_details_education)
    : [];
  const profiles = callerDetails.fc_details_profiles
    ? JSON.parse(callerDetails.fc_details_profiles)
    : null;
  if (callerDetails.emails) {
    callerDetails.emails =
      typeof callerDetails.emails === "string" ||
      callerDetails.emails instanceof String
        ? JSON.parse(callerDetails.emails)
        : callerDetails.emails;
  } else {
    callerDetails.emails = [];
  }
  let data = [];
  if (agent) {
    callerDetails.extension = agent.extension;
    callerDetails.fc_bio = agent.bio;
    callerDetails.avatar = agent.avatar;
    if (callerDetails.default_name === "No Name")
      callerDetails.default_name = agent.name;
  }
  if (callerDetails.age) {
    data.push({
      name: "Age",
      value: callerDetails.age,
    });
  }
  if (callerDetails.gender) {
    data.push({
      name: "Gender",
      value: callerDetails.gender,
    });
  }
  const list = [
    ["marital_status", "Marital Status"],
    ["occupation", "Occupation"],
    ["high_net_worth", "High Net Worth"],
    ["caller_type", "Type"],
    ["phone_carrier", "Phone Carrier"],
    ["phone_line_type", "Phone Line Type"],
    ["carrier_route", "Carrier Route"],
    ["child_present", "Child Present"],
    ["estimated_age", "Estimated Age"],
    ["exact_age", "Exact Age"],
    ["marital", "Marital"],
    ["estimated_income", "Estimated Income"],
    ["ethnic_cd", "Ethnic Cd"],
    ["title", "Title"],
    ["median_yrs_in_school", "Median Yrs In School"],
    ["estimated_wealth", "Estimated Wealth"],
    ["timezone", "Timezone"],
    ["birthdate", "Birthdate"],
  ];
  list.forEach(([name, label]) => {
    if (callerDetails[name])
      data.push({
        name: label,
        value: callerDetails[name],
      });
  });
  if (callerDetails["extra"]) {
    try {
      const extra = JSON.parse(callerDetails["extra"]);
      if (extra) {
        Object.keys(extra).forEach((key) => {
          data.push({
            name: key,
            value: extra[key],
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
  return {
    extraDetails,
    callerDetails,
    data,
    interests,
    topics,
    employment,
    profiles,
    education,
  };
};

const getDefaultData = (phonenumber, agent = null) => ({
  callerDetails: {
    default_name: agent ? agent.name : "No Name",
    nationalFormat: formatNational(agent ? agent.phonenumber : phonenumber),
    extension: agent ? agent.extension : null,
  },
  data: [],
  interests: [],
  topics: [],
  employment: [],
  profiles: [],
  extraDetails: [],
  addresses: [],
  education: [],
});

export const lookupDataSelector = (state) => ({
  phonenumber: state.callerdetails.selected,
  type: state.callerdetails.type,
  invalid: state.callerdetails.invalid,
});

export const lookupPhonenumberSelector = (state) => state.calldata;
export const callerPhonenumberSelector = createSelector(
  lookupDataSelector,
  (lookup) => lookup.phonenumber
);

export const allCallerDetailsSelector = (state) => state.callerdetails;
export const allExtraDetailsSelector = (state) => state.extra_details;

export const selectedPhonenumber = createSelector(
  allCallerDetailsSelector,
  (details) => details.selected
);

export const selectedPhonenumberInvalid = createSelector(
  allCallerDetailsSelector,
  (details) => details.invalid
);

export const extraDetailsSelector = createSelector(
  allExtraDetailsSelector,
  callerPhonenumberSelector,
  (extraDetails, phonenumber) => extraDetails[phonenumber]
);

export const callerDetailsSelector = createSelector(
  allCallerDetailsSelector,
  allExtraDetailsSelector,
  callerPhonenumberSelector,
  agentsSelector,
  (callerdetails, extraDetails, phonenumber, agents) => {
    const agent = agents.find(
      (agent) => getPhoneNumber(agent.phonenumber) === phonenumber
    );
    if (callerdetails.entities[phonenumber]) {
      return formatCallerDetails(
        callerdetails.entities[phonenumber],
        extraDetails[phonenumber],
        agent
      );
    }
    return getDefaultData(phonenumber, agent);
  }
);
window.callerDetailsSelector = callerDetailsSelector;
export const callerDetailsLoadedSelector = createSelector(
  allCallerDetailsSelector,
  (callerdetails) => callerdetails.loaded.includes(callerdetails.selected)
);

export const callerDetailsAvailableSelector = createSelector(
  allCallerDetailsSelector,
  (callerdetails) => callerdetails.ids.includes(callerdetails.selected)
);

export const addressesStateSelector = (state) => state.addresses;
export const addressesEntitiesSelector = createSelector(
  addressesStateSelector,
  (addresses) => addresses.entities
);
export const addressesSelector = (id) =>
  createSelector(addressesEntitiesSelector, (entities) =>
    entities[id] ? entities[id] : {}
  );
