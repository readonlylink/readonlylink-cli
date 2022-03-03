import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { App } from "../../app"
import { Ro } from "../../ro"

type Args = {}
type Opts = {}

export class LogoutCommand extends Command<Args, Opts> {
  name = "logout"

  description = "Logout the current logged-in user"

  args = {}
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command logs out the current logged-in user.`,
      ``,
      blue(`  ${runner.name} ${this.name}`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const app = await App.build()
    const ro = app.create(Ro)
    await ro.logout()
  }
}
