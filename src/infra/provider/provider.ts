import { Coupler } from "../coupler"

export abstract class Provider {
  abstract register(app: Coupler): Promise<void>

  // NOTE A `Provider` might do not need a boot step.
  boot?(app: Coupler): Promise<void>
}
