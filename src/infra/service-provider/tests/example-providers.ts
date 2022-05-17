import { ServiceContainer } from "../../service-container"
import { ServiceProvider } from "../../service-provider"

export class Logger {
  instanceofLogger = true

  log(msg: string): void {
    console.log(msg)
  }
}

export class LoggerProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.bind(Logger, () => new Logger())
  }
}

export class Resource {
  instanceofResource = true

  logger: Logger

  constructor(opts: { logger: Logger }) {
    this.logger = opts.logger
  }
}

export class DbResource extends Resource {
  instanceofDbResource = true

  logger: Logger

  constructor(opts: { logger: Logger }) {
    super(opts)
    this.logger = opts.logger
  }
}

export class DbResourceProvider extends ServiceProvider {
  async register(app: ServiceContainer): Promise<void> {
    app.bind(Resource, (app) => new DbResource({ logger: app.create(Logger) }))
  }
}
