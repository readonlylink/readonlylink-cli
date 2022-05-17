import { ServiceContainer } from "../service-container"

export abstract class ServiceProvider {
  abstract register(app: ServiceContainer): Promise<void>

  // NOTE A ServiceProvider might do not need a boot step.
  boot?(app: ServiceContainer): Promise<void>
}
