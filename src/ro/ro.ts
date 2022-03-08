import axios from "axios"
import os from "os"
import Path from "path"
import { Config } from "../config"
import { User } from "../models/user"

export class Ro {
  constructor(public config: Config) {}

  api(path: string): string {
    return this.config.base_url + path
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
      const {
        data: { username, token },
      } = await axios.get(links.verify_for_token)

      await User.login({ username, email, token })

      console.log({
        message: "Login success, information saved in ~/.readonlylink",
        username,
      })

      process.exit(0)
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error
      if (error.response?.status !== 404) throw error
    }
  }

  async logout(username: string): Promise<void> {
    const user = User.getOrFail({ username, config: this.config })

    await user.logout()

    console.log({
      message: "Logout successful.",
      username,
    })
  }

  getOrFail(username: string): User {
    return User.getOrFail({ username, config: this.config })
  }
}
