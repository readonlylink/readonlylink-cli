import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { project: string; directory?: string }
type Opts = {}

export class DownloadCommand extends Command<Args, Opts> {
  name = "download"

  description = "Download a project to local machine"

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
    ].join("\n")
  }

  async execute(argv: Args & Opts, { app }: CommandRunner<App>): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const ro = app.create(Ro)

    try {
      const files = await ro.readAllFiles(username, projectName)

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
