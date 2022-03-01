import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import axios from "axios"

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
    const { email } = argv

    console.log({ email })

    const {
      data: {
        verifying: { confirmation_code, links },
      },
    } = await axios.post(
      "http://localhost:8000/api/login",
      { email: argv.email },
      { headers: { "Content-Type": "application/json" } }
    )

    console.log({ confirmation_code, links })

    setInterval(async () => {
      try {
        const { data } = await axios.get(links.verify_for_token)
        console.log(data)
      } catch (error) {
        if (!axios.isAxiosError(error)) throw error
        if (error.response?.status !== 404) {
          console.log(error)
        }
      }
    }, 1000)
  }
}
