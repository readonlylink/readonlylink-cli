#!/usr/bin/env node

const process = require("process")

process.on("unhandledRejection", (error) => {
  console.error(error)
  process.exit(1)
})

const { buildCommandRunner } = require("../lib/console")

buildCommandRunner().then((commandRunner) => commandRunner.run())
