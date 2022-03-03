import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import axios from "axios"
import { Ro } from "../../ro"

type Args = { email: string }
type Opts = { force?: boolean }

export class LoginCommand extends Command<Args, Opts> {
  name = "login"

  description = "Login Readonly.Link by email"

  args = { email: ty.string() }
  opts = { force: ty.optional(ty.boolean()) }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command logs in Readonly.Link by email.`,
      ``,
      blue(`  ${runner.name} ${this.name} <example@mail.com>`),
      ``,
      `Successful login will get an access token,`,
      `which will be saved in ${blue("~/.readonlylink")} directory.`,
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const ro = new Ro()

    if (!argv.force) {
      if (await ro.isLoggedIn(argv.email)) process.exit(1)
    }

    try {
      const links = await ro.login(argv.email)
      setInterval(() => ro.verify(links), 3000)
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error
      const report: Record<string, any> = { message: error.message }
      if (error.response?.data) report.details = error.response.data
      console.dir(report, { depth: null })
      process.exit(1)
    }
  }
}
