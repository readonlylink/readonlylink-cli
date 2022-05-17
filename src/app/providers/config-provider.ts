import { Coupler, Provider } from "@xieyuheng/coupler"
import { Config } from "../../config"

export class ConfigProvider extends Provider {
  async register(app: Coupler): Promise<void> {
    app.singleton(Config, (app) => {
      return new Config()
    })
  }
}
