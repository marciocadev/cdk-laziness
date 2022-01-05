#!/usr/bin/env node

// import * as path from "path";
import { program } from "commander";
import * as fs from "fs-extra";
import * as inquirer from "inquirer";
import { LazyDynamoDBEntity } from "../../lazy/dynamodb/lazy-dynamodb-entity";
import { LazyDynamoDBTable } from "../../lazy/dynamodb/lazy-table";

program
  .command("dynamodb-table")
  .alias("table")
  .description("DynamoDB table class from AWS-CDK")
  .action(() => {
    const questions = [
      { type: "input", name: "name", message: "Name your table" },
      {
        type: "input",
        name: "path",
        message: "Path where files will be created",
        default: process.cwd(),
      },
      { type: "input", name: "partitionKey", message: "Partition key name" },
      {
        type: "list",
        name: "partitionType",
        message: "Partition key type",
        choices: ["string", "number"],
      },
      {
        type: "list",
        name: "haveSortKey",
        message: "Need sort key ?",
        choices: ["true", "false"],
      },
      {
        type: "input",
        name: "sortKey",
        message: "Sort key name",
        when: (answers: any) => answers.haveSortKey === "true",
      },
      {
        type: "list",
        name: "sortType",
        message: "Sort key type",
        choices: ["string", "number"],
        when: (answers: any) => answers.haveSortKey === "true",
      },
    ];
    inquirer
      .prompt(questions)
      .then((answers) => {
        console.log(answers);
        const partitionKey: LazyDynamoDBEntity = {
          key: answers.partitionKey,
          type: answers.partitionType,
        };
        let sortKey = undefined;
        if (answers.sortKey) {
          sortKey = {
            key: answers.sortKey,
            type: answers.sortType,
          };
        }
        const table = new LazyDynamoDBTable(answers.name, answers.path);
        table.createTable(partitionKey, sortKey);
        table.synth();

        console.log(answers.path + "/.gitignore");
        fs.unlinkSync(answers.path + "/.gitignore");
        fs.removeSync(answers.path + "/.projen");
      })
      .catch((error) => {
        console.error(error);
        process.exit();
      });
  });
