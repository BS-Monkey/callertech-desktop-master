import { LOAD_MESSAGES } from "../actionCreators/loadMessages";
import { MAKE_MESSAGE_GROUP_READ } from "../actionCreators/makeMessageGroupRead";
import { RESET_MESSAGES } from "../actionCreators/resetMessages";
import { UPDATE_LATEST_MESSAGE_ID } from "../actionCreators/updateLatestMessageId";

const defaultState = {
  latest_message_id: 0,
  entities: {},
  ids: [],
};

const messages = (state = defaultState, action) => {
  if (action.type === MAKE_MESSAGE_GROUP_READ) {
    const msgGroup = [...state.entities[action.payload]].map((msg) => {
      msg.is_read = true;
      return msg;
    });
    const entities = { ...state.entities, [action.payload]: msgGroup };
    return {
      ...state,
      entities,
    };
  }
  if (action.type === LOAD_MESSAGES) {
    const entities = { ...state.entities };
    console.debug("LOAD_MESSAGES@messages.reducer", {
      entities,
      payload: action.payload,
    });
    const payloadIds = Object.keys(action.payload);
    payloadIds.forEach((id) => {
      entities[id] = getUniqueMessages(
        id,
        state.entities[id],
        action.payload[id]
      );
    });
    const newIds = payloadIds.filter((_id) => !state.ids.includes(_id));
    const ids = [...state.ids, ...newIds];
    console.debug("LOAD_MESSAGES@messages.reducer", { entities, ids });
    return {
      ...state,
      ids,
      entities,
    };
  }
  if (action.type === UPDATE_LATEST_MESSAGE_ID) {
    if (state.latest_message_id < action.payload)
      return { ...state, latest_message_id: action.payload };
  }
  if (action.type === RESET_MESSAGES) {
    return defaultState;
  }
  return state;
};

function getUniqueMessages(id, oldEntities, newEntities) {
  console.debug("getUniqueMessages", { id, oldEntities, newEntities });
  let messages = [];
  if (oldEntities) {
    messages = [...oldEntities];
    newEntities.forEach((msg) => {
      if (!messages.find((msg2) => msg2.id === msg.id)) {
        messages.push(msg);
      }
    });
  } else {
    messages = newEntities;
  }
  messages = messages.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? 1 : -1
  );
  console.debug("getUniqueMessages", { messages });
  return messages;
}
export default messages;
