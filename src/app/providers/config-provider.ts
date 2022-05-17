import { Config } from "../../config"
import { Coupler } from "../../infra/coupler"
import { Provider } from "../../infra/provider"

export class ConfigProvider extends Provider {
  async register(app: Coupler): Promise<void> {
    app.singleton(Config, (app) => {
      return new Config()
    })
  }
}
