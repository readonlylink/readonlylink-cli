import axios from "axios"
import Path from "path"
import { config } from "../config"
import { LocalFileStore } from "../infra/local-file-store"

export class User {
  constructor(public username: string) {}

  static async getOrFail(username: string): Promise<User> {
    const local = this.createLocal(username)
    if (!(await local.hasDirectory(""))) {
      throw new Error(`Unknown user: ${username}`)
    }

    return new User(username)
  }

  static async login(opts: {
    username: string
    email: string
    token: string
  }): Promise<void> {
    const local = this.createLocal(opts.username)
    await local.put("access-token", opts.token)
    await local.put("email", opts.email)
  }

  static createLocal(username: string): LocalFileStore {
    return new LocalFileStore(Path.resolve(config.home_dir, "users", username))
  }

  async logout(): Promise<void> {
    await this.local.delete("")
  }

  get local(): LocalFileStore {
    return User.createLocal(this.username)
  }

  api(path: string): string {
    return config.base_url + path
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
