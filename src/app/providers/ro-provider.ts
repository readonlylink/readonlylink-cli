import { ServiceContainer } from "../../infra/service-container"
import { ServiceProvider } from "../../infra/service-provider"
import { Ro } from "../../ro"

export class RoProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(Ro, (app) => {
      return new Ro()
    })
  }
}
