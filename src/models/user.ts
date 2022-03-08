import axios from "axios"
import os from "os"
import Path from "path"
import { Config } from "../config"
import { LocalFileStore } from "../infra/local-file-store"

export class User {
  username: string
  config: Config

  constructor(opts: { username: string; config: Config }) {
    this.username = opts.username
    this.config = opts.config
  }

  get local(): LocalFileStore {
    return new LocalFileStore(Path.resolve(os.homedir(), ".readonlylink"))

    // return new LocalFileStore(
    //   Path.resolve(
    //     os.homedir(),
    //     ".readonlylink/users",
    //     this.username
    //   )
    // )
  }

  api(path: string): string {
    return this.config.base_url + path
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
