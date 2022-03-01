import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"

type Args = { email: string }
type Opts = { name?: string }

export class LoginCommand extends Command<Args, Opts> {
  name = "login"

  description = "Login Readonly.Link by email"

  args = { email: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command login Readonly.Link by email.`,
      ``,
      blue(`  ${runner.name} ${this.name} <example@mail.com>`),
      ``,
      `Successful login will get an access token,`,
      `which will be saved in ${blue("~/.readonlylink")} directory.`,
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    console.log(argv)
  }
}
