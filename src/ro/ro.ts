import axios from "axios"
import os from "os"
import Path from "path"
import { LocalFileStore } from "../infra/local-file-store"

export class Ro {
  isDev = process.env.NODE_ENV === "dev"

  config = {
    base_url: this.isDev
      ? "http://localhost:8000/api"
      : "https://readonly.link/api",
  }

  local = new LocalFileStore(Path.resolve(os.homedir(), ".readonlylink"))

  url(path: string): string {
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

  async login(email: string): Promise<Links> {
    const response = await axios.post(this.url("/login"), { email })

    const { confirmation_code, links } = response.data

    console.log({
      message: "Waiting for email confirmation.",
      confirmation_code,
    })

    return links
  }

  async verify(links: Links): Promise<void> {
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

    console.log(await this.local.get("username"))
  }
}

type Links = {
  verify_for_token: string
}

async function info(): Promise<void> {
  const url = "http://localhost:8000/api/files/xieyuheng/test2/-/k1/README.md"
  // const url = "http://localhost:8000/api/user"
  // const url =
  //   process.env.NODE_ENV === "dev"
  //   ? "http://localhost:8000/api/user"
  //   : "https://readonly.link/api/user"

  // const token = await fs.promises.readFile(PREFIX + "/access-token", "utf8")

  // try {
  //   const response = await axios.put(url, 'haha', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   console.log(response.data)
  // } catch (error) {
  //   if (!axios.isAxiosError(error)) throw error
  //   else console.log(error.response.data)
  // }
}
