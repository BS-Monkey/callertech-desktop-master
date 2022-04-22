"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;
const packageJson = require("../../package.json");

let options = {
  appId: packageJson.appId,
  artifactName: `${packageJson.name}-setup-${packageJson.version}.exe`,
  productName: packageJson.productName,
  directories: {
    output: "release-builds"
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"]
      }
    ],
    icon: "build/icon.png"
  },
  nsis: {
    include: "installer.nsh"
  },
  mac: {
    icon: "dist",
    target: ["zip", "dmg"]
  },
  publish: {
    provider: "s3",
    bucket: "callertech-web-app",
    region: "us-west-2"
  }
};

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: options,
    publish: true
  })
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.error(e);
  });
