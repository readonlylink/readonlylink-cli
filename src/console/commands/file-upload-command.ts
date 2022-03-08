import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { file: string; project: string }
type Opts = {}

export class FileUploadCommand extends Command<Args, Opts> {
  name = "file-upload"

  description = "Upload a file to a project"

  args = { file: ty.string(), project: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner<App>): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command upload a single file to a existing project.`,
      ``,
      `Note that, it must be ran in a project's root directory.`,
      ``,
      blue(`  ${runner.name} ${this.name} README.md xieyuheng/xieyuheng`),
      ``,
      `We can omit project name if it is the same as user name.`,
      ``,
      blue(`  ${runner.name} ${this.name} README.md xieyuheng`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts, { app }: CommandRunner<App>): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const ro = app.create(Ro)
    const user = await ro.getUserOrExit(username)

    const local = new LocalFileStore(process.cwd())
    const text = await local.get(argv.file)

    try {
      console.log({
        message: "File uploading ...",
        username,
        project: projectName,
        file: argv.file,
        bytes: text.length,
      })

      await user.writeFiles(projectName, { [argv.file]: text })

      console.log({
        message: "File uploaded.",
      })
    } catch (error) {
      const reporter = app.create(ErrorReporter)
      reporter.reportErrorAndExit(error)
    }
  }
}
