import { createSelector } from "reselect";

export const agentStateSelector = (state) => state.agents;

export const agentsSelector = createSelector(agentStateSelector, (agentState) =>
  agentState.ids.map((id) => agentState.entities[id])
);

export const agentFromPhonenumber = (phonenumber, agents) =>
  agents.find((agent) => agent.phonenumber === phonenumber);

export const agentFromExtension = (extension, agents) =>
  agents.find((agent) => agent.extension === extension);

export const agentLoadedSelector = createSelector(
  agentStateSelector,
  (agentState) => agentState.loaded
);
