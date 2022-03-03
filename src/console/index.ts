import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import * as CommandRunners from "@enchanterjs/enchanter/lib/command-runners"
import { CommonHelpCommand } from "@enchanterjs/enchanter/lib/commands"
import { App } from "../app"
import * as Commands from "./commands"

export async function createCommandRunner(): Promise<CommandRunner> {
  return new CommandRunners.CommonCommandRunner({
    app: await App.build(),
    defaultCommand: new CommonHelpCommand(),
    commands: [
      new Commands.LoginCommand(),
      new Commands.LogoutCommand(),
      new Commands.WhoCommand(),
      new CommonHelpCommand(),
    ],
  })
}
