"use strict";
const packageJson = require("./package.json");

let options = {
  appId: packageJson.appId,
  artifactName: `${packageJson.name}-setup-\${version}-\${os}-x64.\${ext}`,
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
    target: ["dmg"]
  },
  forceCodeSigning: false,
  publish: {
    provider: "s3",
    bucket: "callertech-web-app",
    region: "us-west-2"
  }
};
module.exports = options;
