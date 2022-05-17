import { Config } from "../../config"
import { ServiceContainer } from "../../infra/service-container"
import { ServiceProvider } from "../../infra/service-provider"

export class ConfigProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.singleton(Config, (app) => {
      return new Config()
    })
  }
}
