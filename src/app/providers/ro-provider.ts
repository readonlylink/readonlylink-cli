import { Coupler, Provider } from "@xieyuheng/coupler"
import { Ro } from "../../ro"

export class RoProvider extends Provider {
  async register(app: Coupler): Promise<void> {
    app.singleton(Ro, (app) => {
      return new Ro()
    })
  }
}
