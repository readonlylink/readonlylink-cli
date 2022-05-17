import { Coupler } from "@xieyuheng/coupler"
import * as Providers from "./providers"

export class App extends Coupler {
  static async build(): Promise<App> {
    const app = new App()
    const providers = Object.values(Providers).map((Provider) => new Provider())
    await app.bootstrap(providers, { silent: true })
    return app
  }
}
