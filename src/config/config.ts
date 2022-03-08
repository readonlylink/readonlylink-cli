import os from "os"
import Path from "path"

export class Config {
  isDev = process.env.NODE_ENV === "dev"

  base_url = this.isDev
    ? "http://localhost:8000/api"
    : "https://readonly.link/api"

  home_dir = this.isDev
    ? Path.resolve(os.homedir(), ".readonlylink/dev")
    : Path.resolve(os.homedir(), ".readonlylink")
}

export const config = new Config()
