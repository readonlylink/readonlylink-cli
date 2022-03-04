import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { directory: string; project: string }
type Opts = {}

export class UploadCommand extends Command<Args, Opts> {
  name = "upload"

  description = "Upload a directory as project"

  args = { directory: ty.string(), project: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner<App>): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command upload a directory as project.`,
      ``,
      `Note that, it knows about the ${blue(".gitignore")} file.`,
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
    const files = await local.all()

    try {
      await ro.writeAllFiles(username, projectName, files)
      console.log({
        username,
        project: projectName,
        files: Object.keys(files).length,
        bytes: Object.values(files).reduce((sum, file) => sum + file.length, 0),
      })
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }
  }
}
