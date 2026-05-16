import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
