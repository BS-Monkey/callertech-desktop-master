var fs = require("fs");
var path = require("path");

const DEST_PATH = path.resolve(__dirname, "../public/config.js");

const configPath = path.resolve(__dirname, `${process.env.NODE_ENV}.js`);
console.log(`Copying ${configPath}`);
try {
  fs.copyFileSync(configPath, DEST_PATH);
  console.log(`Copied to ${DEST_PATH}`);
} catch (err) {
  console.error(err);
}
