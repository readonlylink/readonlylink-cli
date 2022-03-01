import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import fs from "fs"
import os from "os"
import Path from "path"

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
    await logout()
  }
}

const PREFIX = Path.resolve(os.homedir(), ".readonlylink")

async function logout(): Promise<void> {
  if (!fs.existsSync(PREFIX + "/username")) {
    console.log({ message: "Nobody is logged-in yet." })
    return
  }

  const username = await fs.promises.readFile(PREFIX + "/username", "utf8")

  fs.rmSync(PREFIX + "/username", { force: true })
  fs.rmSync(PREFIX + "/access-token", { force: true })

  console.log({
    message: "Logout successful.",
    username,
  })
}
