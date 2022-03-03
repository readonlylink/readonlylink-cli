import { ServiceProvider } from "@enchanterjs/enchanter/lib/service-provider"
import { ServiceContainer } from "@enchanterjs/enchanter/lib/service-container"
import { Ro } from "../../ro"
import { Config } from "../../config"

export class RoProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(Ro, (app) => {
      return new Ro(app.create(Config))
    })
  }
}
