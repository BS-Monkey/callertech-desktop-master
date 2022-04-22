import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "react-redux";
import store from "./redux/store";
import "react-chat-elements/dist/main.css";

window._store = store;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
module.hot.accept();
