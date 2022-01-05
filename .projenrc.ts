import { typescript } from "projen";
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "cdk-laziness",
  projenrcTs: true,

  codeCov: true,
  gitpod: true,
  prettier: true,
  eslint: true,
  jestOptions: {
    coverageText: false,
  },
  docgen: true,
  tsconfig: {
    compilerOptions: {
      lib: ["dom", "es2019"],
      resolveJsonModule: true,
    },
  },

  repository: "https://github.com/marciocadev/cdk-lazyless.git",
  release: true,
  releaseToNpm: true,

  bin: {
    "cdk-laziness": "lib/index.js",
  },

  deps: ["projen"],
  devDeps: [
    "@types/node-notifier",
    "@types/typescript",
    "@types/inquirer",
    "@types/cli-color",
    "@types/fs-extra",
  ],
  bundledDeps: [
    "cli-color",
    "node-notifier",
    "commander",
    "inquirer",
    "fs-extra",
  ],
});

project.synth();
