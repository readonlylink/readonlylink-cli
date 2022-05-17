import { ErrorReporter } from "../../errors/error-reporter"
import { Coupler } from "../../infra/coupler"
import { Provider } from "../../infra/provider"

export class ErrorReporterProvider extends Provider {
  async register(app: Coupler): Promise<void> {
    app.singleton(ErrorReporter, (app) => {
      return new ErrorReporter()
    })
  }
}
