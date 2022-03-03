import { ServiceProvider } from "@enchanterjs/enchanter/lib/service-provider"
import { ServiceContainer } from "@enchanterjs/enchanter/lib/service-container"
import { Config } from "../../config"

export class ConfigProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(Config, (app) => {
      return new Config()
    })
  }
}
