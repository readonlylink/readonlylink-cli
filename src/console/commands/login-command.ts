import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { Ro } from "../../ro"

type Args = { email: string }
type Opts = { force?: boolean }

export class LoginCommand extends Command<Args, Opts> {
  name = "login"

  description = "Login Readonly.Link by email"

  args = { email: ty.string() }
  opts = { force: ty.optional(ty.boolean()) }

  // prettier-ignore
  help(runner: CommandRunner<App>): string {
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

  async execute(argv: Args & Opts, { app }: CommandRunner<App>): Promise<void> {
    const ro = app.create(Ro)

    if ((await ro.isUserLoggedIn(argv.email)) && !argv.force) {
      console.log({
        message: "Already logged-in. Please use --force to login again.",
        suggested_command: `ro login ${argv.email} --force`,
      })

      process.exit(1)
    }

    try {
      const links = await ro.login(argv.email)
      setInterval(() => ro.verify(argv.email, links), 3000)
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }
  }
}
