import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import axios from "axios"
import Path from "path"
import fs from "fs"
import os from "os"

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
    try {
      const links = await login(argv.email)
      setInterval(() => verify(links), 1000)
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error
      console.error({ message: error.message, data: error.response?.data })
      process.exit(1)
    }
  }
}

type Links = {
  verify_for_token: string
}

async function login(email: string): Promise<Links> {
  const url =
    process.env.NODE_ENV === "dev"
      ? "http://localhost:8000/api/login"
      : "https://readonly.link/api/login"

  const response = await axios.post(url, { email })

  const { confirmation_code, links } = response.data

  console.log({
    message: "Waiting for email confirmation.",
    confirmation_code,
  })

  return links
}

async function verify(links: Links): Promise<void> {
  try {
    const { data } = await axios.get(links.verify_for_token)

    const path = Path.resolve(os.homedir(), ".readonlylink/access-token")
    await fs.promises.mkdir(Path.dirname(path), { recursive: true })
    await fs.promises.writeFile(path, data.token)

    console.log({
      message: "Login success, access token saved.",
      username: data.username,
      path,
    })

    process.exit(0)
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error
    if (error.response?.status !== 404) throw error
  }
}
