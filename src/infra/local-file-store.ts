import fs from "fs"
import Path from "path"

export class LocalFileStore {
  constructor(public root: string) {}

  resolve(path: string): string {
    return `${this.root}/${path}`
  }

  async has(path: string): Promise<boolean> {
    try {
      await fs.promises.access(this.resolve(path))
      const stats = await fs.promises.lstat(this.resolve(path))
      return stats.isFile()
    } catch (_error) {
      return false
    }
  }

  async get(path: string): Promise<string> {
    return await fs.promises.readFile(this.resolve(path), "utf8")
  }

  async put(path: string, text: string): Promise<void> {
    const dir = Path.dirname(this.resolve(path))
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(this.resolve(path), text)
  }

  async delete(path: string): Promise<void> {
    await fs.promises.rm(this.resolve(path), { force: true })
  }
}
