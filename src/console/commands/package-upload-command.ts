import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import chunk from "lodash/chunk"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { directory: string; project: string }
type Opts = {}

export class PackageUploadCommand extends Command<Args, Opts> {
  name = "package-upload"

  description = "Upload a directory as project"

  args = { directory: ty.string(), project: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner<App>): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command upload a directory as project.`,
      ``,
      `Note that, it knows about the ${blue(".gitignore")} and ${blue(".roignore")} file,`,
      `and the ${blue(".git/")} directory will also be ignored.`,
      ``,
      blue(`  ${runner.name} ${this.name} ./cicada-monologues xieyuheng/cicada-monologues`),
      blue(`  ${runner.name} ${this.name} ./inner xieyuheng/xieyuheng`),
      ``,
      `We can omit project name if it is the same as user name.`,
      ``,
      blue(`  ${runner.name} ${this.name} ./inner xieyuheng`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts, { app }: CommandRunner<App>): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const ro = app.create(Ro)

    const local = new LocalFileStore(argv.directory)
    const files = await local.all({
      ignorePrefixs: [".git/"],
      ignoreFiles: [".gitignore", ".roignore"],
    })

    try {
      await ro.createProjectIfNeed(username, projectName)

      console.log({
        username,
        project: projectName,
      })

      // await uploadFiles(username, projectName, files)
      await uploadFilesByChunk(username, projectName, files)
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }

    async function uploadFiles(
      username: string,
      projectName: string,
      files: Record<string, string>
    ): Promise<void> {
      await ro.writeFiles(username, projectName, files)
      console.log({
        files: Object.keys(files).length,
        bytes: Object.values(files).reduce((sum, file) => sum + file.length, 0),
      })
    }

    async function uploadFilesByChunk(
      username: string,
      projectName: string,
      files: Record<string, string>
    ): Promise<void> {
      for (const group of chunk(Object.entries(files), 8)) {
        await ro.writeFiles(username, projectName, Object.fromEntries(group))
        for (const [path, text] of group) {
          console.log({ path, size: text.length })
        }
      }

      console.log({
        files: Object.keys(files).length,
        bytes: Object.values(files).reduce((sum, file) => sum + file.length, 0),
      })
    }
  }
}
