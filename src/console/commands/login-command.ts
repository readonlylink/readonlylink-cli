import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import axios from "axios"
import fs from "fs"
import os from "os"
import Path from "path"

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
    if (!argv.force) {
      await checkLoggedIn(argv.email)
    }

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

const PREFIX = Path.resolve(os.homedir(), ".readonlylink")

async function checkLoggedIn(email: string): Promise<void> {
  if (!fs.existsSync(PREFIX + "/username")) return

  const username = await fs.promises.readFile(PREFIX + "/username", "utf8")

  console.log({
    message: "Already logged-in. Please use --force to login again.",
    suggested_command: `ro login ${email} --force`,
    username,
  })

  process.exit(1)
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

    await saveText(PREFIX + "/access-token", data.token)
    await saveText(PREFIX + "/username", data.username)

    console.log({
      message: "Login success, information saved in ~/.readonlylink",
      username: data.username,
    })

    process.exit(0)
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error
    if (error.response?.status !== 404) throw error
  }
}

async function saveText(path: string, text: string): Promise<void> {
  await fs.promises.mkdir(Path.dirname(path), { recursive: true })
  await fs.promises.writeFile(path, text)
}
