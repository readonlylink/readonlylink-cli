import { ServiceContainer } from "@enchanterjs/enchanter/lib/service-container"
import { ServiceProvider } from "@enchanterjs/enchanter/lib/service-provider"
import { Ro } from "../../ro"

export class RoProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(Ro, (app) => {
      return new Ro()
    })
  }
}
