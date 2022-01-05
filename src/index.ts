#!/usr/bin/env node

import { program } from "commander";
import "./commands/table";
// import "./commands/aws-cdk/dynamodb";
import { AWS_LAZINESS_VERSION } from "./common";

program.version(
  AWS_LAZINESS_VERSION,
  "-v, --version",
  "output current version"
);
program.parse(process.argv);
