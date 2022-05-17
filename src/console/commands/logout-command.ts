import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { Ro } from "../../ro"

type Args = { username: string }
type Opts = {}

export class LogoutCommand extends Command<Args, Opts> {
  name = "logout"

  description = "Logout a given user"

  args = { username: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command logs out a given user.`,
      ``,
      blue(`  ${runner.name} ${this.name} <username>`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const app = await App.build()
    const ro = app.create(Ro)
    await ro.logout(argv.username)
  }
}
