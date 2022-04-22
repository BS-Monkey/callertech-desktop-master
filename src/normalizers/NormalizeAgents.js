import { schema, normalize } from "normalizr";
export const normalizeAgents = (data) => {
  if (!data.length) {
    return {
      ids: [],
      entities: {},
    };
  }
  const agentsSchema = new schema.Entity(
    "agents",
    {},
    { idAttribute: "extension" }
  );
  const normalizedAgents = normalize(data, [agentsSchema]);
  console.log(normalizedAgents);
  return {
    ids: Object.keys(normalizedAgents.entities.agents),
    entities: normalizedAgents.entities.agents,
  };
};
