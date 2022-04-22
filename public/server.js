const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");

let initialized = false;
let app = null;
let server = null;

const initServer = () =>
  new Promise((resolve) => {
    if (initialized) {
      return resolve(false);
    }
    app = express();
    server = http.createServer(app);
    server.listen(9698, () => {
      console.log("listening on *:9698");
      initialized = true;
      return resolve(true);
    });
  });

const initRoutes = (handler) => {
  app.use(bodyParser.json());
  app.post("/lookup", handler);
};

const init = async (handler) => {
  await initServer();
  initRoutes((req, res) => {
    console.log("Request recieved: ", req.body);
    handler(req.body);
    return res.send("OK");
  });
};

module.exports = {
  init,
};
