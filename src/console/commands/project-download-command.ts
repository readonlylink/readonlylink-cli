import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { project: string; directory?: string }
type Opts = {}

export class ProjectDownloadCommand extends Command<Args, Opts> {
  name = "project-download"

  description = "Download a project to directory"

  args = { project: ty.string(), directory: ty.optional(ty.string()) }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command downloads a project,`,
      `and it use the project name as directory name.`,
      ``,
      blue(`  ${runner.name} ${this.name} xieyuheng/cicada-monologues`),
      ``,
      `If given a directory, the downloaded project will be saved into the directory.`,
      `If the directory does not exist, the command will create one.`,
      ``,
      blue(`  ${runner.name} ${this.name} xieyuheng/xieyuheng inner`),
      ``,
      `We can omit project name if it is the same as user name.`,
      ``,
      blue(`  ${runner.name} ${this.name} xieyuheng inner`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const app = await App.build()
    const ro = app.create(Ro)
    const user = await ro.getUserOrExit(username)

    try {
      const local = new LocalFileStore(argv.directory ?? projectName)

      console.log({
        message: "Project downloading ...",
        username,
        project: projectName,
        directory: local.root,
      })

      const files = await user.readAllFiles(projectName)
      const entries = Object.entries(files)

      for (const [path, text] of entries) {
        await local.put(path, text)
      }

      console.log({
        message: "Project downloaded.",
        files: entries.length,
        bytes: entries.reduce((sum, [path, file]) => sum + file.length, 0),
      })
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }
  }
}
