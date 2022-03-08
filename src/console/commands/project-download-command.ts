import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
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
  help(runner: CommandRunner<App>): string {
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

  async execute(argv: Args & Opts, { app }: CommandRunner<App>): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const ro = app.create(Ro)
    const user = ro.getOrFail(username)

    try {
      const files = await user.readAllFiles(projectName)

      const local = new LocalFileStore(argv.directory ?? projectName)

      console.log(`directory: ${local.root}`)

      for (const [path, text] of Object.entries(files)) {
        await local.put(path, text)
        console.log(`- ${path}`)
      }
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }
  }
}
