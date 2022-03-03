import {
  CommandRunner,
  createCommandRunner,
} from "@enchanterjs/enchanter/lib/command-runner"
import { App } from "../app"
import * as Commands from "./commands"

export async function buildCommandRunner(): Promise<CommandRunner> {
  return createCommandRunner({
    app: await App.build(),
    defaultCommand: new Commands.HelpCommand(),
    commands: [
      new Commands.HelpCommand(),
      new Commands.LoginCommand(),
      new Commands.LogoutCommand(),
      new Commands.WhoCommand(),
      new Commands.DownloadCommand(),
    ],
  })
}
