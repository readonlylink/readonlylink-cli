import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { App } from "../../app"
import { ErrorReporter } from "../../errors/error-reporter"
import { LocalFileStore } from "../../infra/local-file-store"
import { Ro } from "../../ro"

type Args = { project: string; file: string }
type Opts = {}

export class FileUploadCommand extends Command<Args, Opts> {
  name = "file-upload"

  description = "Upload a file to a project"

  args = { project: ty.string(), file: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command upload a single file to a existing project.`,
      ``,
      `Note that, it must be ran in a project's root directory.`,
      ``,
      blue(`  ${runner.name} ${this.name} xieyuheng/xieyuheng README.md`),
      ``,
      `We can omit project name if it is the same as user name.`,
      ``,
      blue(`  ${runner.name} ${this.name} xieyuheng README.md`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    let [username, projectName] = argv.project.split("/")
    if (!projectName) projectName = username

    const app = await App.build()
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
