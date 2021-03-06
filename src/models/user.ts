import axios from "axios"
import Path from "path"
import { config } from "../config"
import { LocalFileStore } from "../infra/local-file-store"

export class User {
  constructor(public username: string) {}

  api(path: string): string {
    return config.base_url + path
  }

  static createLocal(username: string): LocalFileStore {
    return new LocalFileStore(Path.resolve(config.home_dir, "users", username))
  }

  static async get(username: string): Promise<User | undefined> {
    const local = this.createLocal(username)
    if (!(await local.hasDirectory(""))) {
      return
    }

    return new User(username)
  }

  static async getOrFail(username: string): Promise<User> {
    const user = await this.get(username)
    if (user === undefined) {
      throw new Error(`Unknown username: ${username}`)
    }

    return user
  }

  static async getOrExit(username: string): Promise<User> {
    try {
      return await this.getOrFail(username)
    } catch (error) {
      if (!(error instanceof Error)) throw error

      console.dir(
        {
          message: "Fail to get user.",
          username,
          error: {
            message: error.message,
          },
        },
        { depth: null }
      )

      process.exit(1)
    }
  }

  static async all(): Promise<Array<User>> {
    const local = this.createLocal("")
    const directories = await local.directories("")
    const users: Array<User> = []
    for (const directory of directories) {
      const user = await this.get(directory)
      if (user !== undefined) {
        users.push(user)
      }
    }

    return users
  }

  static async isLoggedIn(email: string): Promise<boolean> {
    for (const user of await this.all()) {
      if ((await user.local.get("email")) === email) {
        return true
      }
    }

    return false
  }

  static async create(opts: {
    username: string
    email: string
    token: string
  }): Promise<User> {
    const local = this.createLocal(opts.username)
    await local.put("access-token", opts.token)
    await local.put("email", opts.email)
    return new User(opts.username)
  }

  async delete(): Promise<void> {
    await this.local.deleteAll()
  }

  get local(): LocalFileStore {
    return User.createLocal(this.username)
  }

  async readAllFiles(projectName: string): Promise<Record<string, string>> {
    const token = await this.local.get("access-token")

    const { data: files } = await axios.get(
      this.api(`/files/${this.username}/${projectName}`),
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return files
  }

  async writeFiles(
    projectName: string,
    files: Record<string, string>
  ): Promise<void> {
    const token = await this.local.get("access-token")

    await axios.patch(
      this.api(`/files/${this.username}/${projectName}`),
      { files },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  async createProjectIfNeed(projectName: string): Promise<void> {
    const token = await this.local.get("access-token")

    await axios.patch(
      this.api(`/projects/${this.username}/${projectName}`),
      "",
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }
}
