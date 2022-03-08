import axios from "axios"
import os from "os"
import Path from "path"
import { Config } from "../config"
import { LocalFileStore } from "../infra/local-file-store"
import { User } from "../models/user"

export class Ro {
  constructor(public config: Config) {}

  local = new LocalFileStore(Path.resolve(os.homedir(), ".readonlylink"))

  api(path: string): string {
    return this.config.base_url + path
  }

  async isLoggedIn(email: string): Promise<boolean> {
    if (!(await this.local.has("username"))) return false

    console.log({
      message: "Already logged-in. Please use --force to login again.",
      suggested_command: `ro login ${email} --force`,
      username: await this.local.get("username"),
    })

    return true
  }

  async login(email: string): Promise<{ verify_for_token: string }> {
    const response = await axios.post(this.api("/login"), { email })

    const { confirmation_code, links } = response.data

    console.log({
      message: "Waiting for email confirmation.",
      confirmation_code,
    })

    return links
  }

  async verify(
    email: string,
    links: { verify_for_token: string }
  ): Promise<void> {
    try {
      const { data } = await axios.get(links.verify_for_token)

      await this.local.put("access-token", data.token)
      await this.local.put("username", data.username)

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

  async logout(): Promise<void> {
    if (!(await this.local.has("username"))) {
      console.log({ message: "Nobody is logged-in yet." })
      return
    }

    const username = await this.local.get("username")

    await this.local.delete("username")
    await this.local.delete("access-token")

    console.log({
      message: "Logout successful.",
      username,
    })
  }

  async who(): Promise<void> {
    if (!(await this.local.has("username"))) return

    const username = await this.local.get("username")

    console.log(username)
  }

  getUserOrFail(username: string): User {
    return new User({ username, config: this.config })
  }
}
