import { ADD_CONTACT } from "../actionCreators/addContact";

const defaultState = {
  current_page: 1,
  last_page: 1,
  total: 0,
  data: [],
};
const contacts_list = (state = defaultState, action) => {
  if (action.type == ADD_CONTACT) {
    return action.payload;
  }
  return state;
};
export default contacts_list;
