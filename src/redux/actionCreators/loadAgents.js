export const LOAD_AGENTS = "LOAD_AGENTS";

export const loadAgents = (data) => {
  return {
    type: LOAD_AGENTS,
    payload: data,
  };
};
