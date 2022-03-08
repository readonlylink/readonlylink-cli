import axios from "axios"
import { config } from "../config"
import { User } from "../models/user"

export class Ro {
  api(path: string): string {
    return config.base_url + path
  }

  async allUsers(): Promise<Array<User>> {
    return await User.all()
  }

  async isUserLoggedIn(email: string): Promise<boolean> {
    return await User.isLoggedIn(email)
  }
  
  async getUserOrExit(username: string): Promise<User> {
    return await User.getOrExit(username)
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

      await User.create({ username, email, token })

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
    const user = await User.getOrExit(username)

    await user.delete()

    console.log({
      message: "Logout successful.",
      username,
    })
  }
}
