import ty from "@xieyuheng/ty"
import axios from "axios"
import fs from "fs"
import os from "os"
import Path from "path"

export class Ro {
  isDev = process.env.NODE_ENV === "dev"

  config = {
    base_url: this.isDev
      ? "http://localhost:8000/api"
      : "https://readonly.link/api",
  }

  url(path: string): string {
    return this.config.base_url + path
  }

  resolve(path: string): string {
    const prefix = Path.resolve(os.homedir(), ".readonlylink")
    return `${prefix}/${path}`
  }

  async isLoggedIn(email: string): Promise<boolean> {
    if (!fs.existsSync(this.resolve("username"))) return false

    const username = await fs.promises.readFile(
      this.resolve("username"),
      "utf8"
    )

    console.log({
      message: "Already logged-in. Please use --force to login again.",
      suggested_command: `ro login ${email} --force`,
      username,
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

      await saveText(this.resolve("access-token"), data.token)
      await saveText(this.resolve("username"), data.username)

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
    if (!fs.existsSync(this.resolve("username"))) {
      console.log({ message: "Nobody is logged-in yet." })
      return
    }

    const username = await fs.promises.readFile(
      this.resolve("username"),
      "utf8"
    )

    fs.rmSync(this.resolve("username"), { force: true })
    fs.rmSync(this.resolve("access-token"), { force: true })

    console.log({
      message: "Logout successful.",
      username,
    })
  }

  async who(): Promise<void> {
    if (!fs.existsSync(this.resolve("username"))) return
    const username = await fs.promises.readFile(
      this.resolve("username"),
      "utf8"
    )
    console.log(username)
  }
}

type Links = {
  verify_for_token: string
}

async function saveText(path: string, text: string): Promise<void> {
  await fs.promises.mkdir(Path.dirname(path), { recursive: true })
  await fs.promises.writeFile(path, text)
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
