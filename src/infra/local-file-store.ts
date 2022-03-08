import fs from "fs"
import walk from "ignore-walk"
import Path from "path"

export class LocalFileStore {
  constructor(public root: string) {}

  resolve(path: string): string {
    return `${this.root}/${path}`
  }

  async hasFile(path: string): Promise<boolean> {
    try {
      await fs.promises.access(this.resolve(path))
      const stats = await fs.promises.lstat(this.resolve(path))
      return stats.isFile()
    } catch (_error) {
      return false
    }
  }

  async hasDirectory(path: string): Promise<boolean> {
    try {
      await fs.promises.access(this.resolve(path))
      const stats = await fs.promises.lstat(this.resolve(path))
      return stats.isDirectory()
    } catch (_error) {
      return false
    }
  }

  async has(path: string): Promise<boolean> {
    return this.hasFile(path) || this.hasDirectory(path)
  }

  async get(path: string): Promise<string> {
    return await fs.promises.readFile(this.resolve(path), "utf8")
  }

  async put(path: string, text: string): Promise<void> {
    const dir = Path.dirname(this.resolve(path))
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(this.resolve(path), text)
  }

  async delete(path: string = ""): Promise<void> {
    await fs.promises.rm(this.resolve(path), {
      recursive: true,
      force: true,
    })
  }

  async all(
    opts: {
      ignorePrefixs: Array<string>
      ignoreFiles: Array<string>
    } = {
      ignorePrefixs: [],
      ignoreFiles: [],
    }
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {}

    for (const path of await this.keys(opts)) {
      if (
        !opts.ignorePrefixs.some(
          (prefix) => path.startsWith(prefix) || path.includes("/" + prefix)
        )
      ) {
        files[path] = await this.get(path)
      }
    }

    return files
  }

  async keys(
    opts: {
      ignorePrefixs: Array<string>
      ignoreFiles: Array<string>
    } = {
      ignorePrefixs: [],
      ignoreFiles: [],
    }
  ): Promise<Array<string>> {
    return walk.sync({
      path: this.root,
      ignoreFiles: opts.ignoreFiles,
      includeEmpty: true,
    })
  }
}
