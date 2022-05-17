import { ErrorReporter } from "../../errors/error-reporter"
import { ServiceContainer } from "../../infra/service-container"
import { ServiceProvider } from "../../infra/service-provider"

export class ErrorReporterProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(ErrorReporter, (app) => {
      return new ErrorReporter()
    })
  }
}
