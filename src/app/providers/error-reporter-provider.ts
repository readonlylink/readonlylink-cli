import { Coupler, Provider } from "@xieyuheng/coupler"
import { ErrorReporter } from "../../errors/error-reporter"

export class ErrorReporterProvider extends Provider {
  async register(app: Coupler): Promise<void> {
    app.singleton(ErrorReporter, (app) => {
      return new ErrorReporter()
    })
  }
}
