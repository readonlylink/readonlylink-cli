import { ServiceContainer } from "@enchanterjs/enchanter/lib/service-container"
import { ServiceProvider } from "@enchanterjs/enchanter/lib/service-provider"
import { ErrorReporter } from "../../errors/error-reporter"

export class ErrorReporterProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(ErrorReporter, (app) => {
      return new ErrorReporter()
    })
  }
}
