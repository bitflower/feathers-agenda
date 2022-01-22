'use strict';
const path = require("path");

module.exports = {
  extension: ["ts"],
  package: path.join(__dirname, "./package.json"),
  ui: "bdd",
  spec: [
    "./test/**/*.test.ts",
  ],
  exit: true,
  require: [
    "ts-node/register",
    path.join(__dirname, "./test/fixtures.ts")
  ]
};
