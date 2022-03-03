import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { Ro } from "../../ro"

type Args = {}
type Opts = {}

export class WhoCommand extends Command<Args, Opts> {
  name = "who"

  description = "Display current logged-in username"

  args = {}
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command displays current logged-in username,`,
      `and do nothing if there is no logged-in user.`,
      ``,
      blue(`  ${runner.name} ${this.name}`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const ro = new Ro()

    await ro.who()
  }
}
