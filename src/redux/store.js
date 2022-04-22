import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { reducer } from "./reducers/index";
const defaultState = require("./default-data.json");

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = compose;
export const store = createStore(
  reducer,
  defaultState,
  composeEnhancers(applyMiddleware(thunk))
);
export default store;
