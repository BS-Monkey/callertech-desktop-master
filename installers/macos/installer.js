"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;
const packageJson = require("../../package.json");
let options = {
  appId: packageJson.appId,
  artifactName: `${packageJson.name}-setup-${packageJson.version}`,
  productName: packageJson.productName,
  directories: {
    output: "release-builds"
  },
  mac: {
    target: ["zip"],
    icon: "build/icon.png"
  }
};

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: options,
    publish: true
  })
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.error(e);
  });
