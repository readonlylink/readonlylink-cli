import { Command, CommandRunner } from "@xieyuheng/command-line"
import { App } from "../../app"
import { Ro } from "../../ro"

type Args = {}
type Opts = {}

export class UserListCommand extends Command<Args, Opts> {
  name = "user-list"

  description = "List all logged-in users"

  args = {}
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command lists all logged-in users.`,
      ``,
      blue(`  ${runner.name} ${this.name}`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const app = await App.build()
    const ro = app.create(Ro)

    const users = await ro.allUsers()

    for (const user of users) {
      console.log(user.username)
    }
  }
}
