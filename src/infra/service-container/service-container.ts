import { Logger } from "../logger"
import * as Loggers from "../loggers"
import { ServiceProvider } from "../service-provider"

type Constructor = abstract new (...args: Array<any>) => any

export class ServiceContainer {
  logger: Logger = new Loggers.PrettyLogger()

  create<C extends Constructor>(inputClass: C): InstanceType<C> {
    throw new Error(`I can not resolve class: ${inputClass.name}`)
  }

  bind<C1 extends Constructor>(
    GivenClass: C1,
    factory: (container: ServiceContainer) => InstanceType<C1>
  ): void {
    const create = this.create

    this.create = <C2 extends Constructor>(
      InputClass: C1 | C2
    ): InstanceType<C2> => {
      if (InputClass === GivenClass) {
        return factory(this) as any
      } else {
        return create(InputClass) as any
      }
    }
  }

  private singletonCache: Map<Constructor, unknown> = new Map()

  singleton<C1 extends Constructor>(
    GivenClass: C1,
    factory: (container: ServiceContainer) => InstanceType<C1>
  ): void {
    const create = this.create

    this.create = <C2 extends Constructor>(
      InputClass: C1 | C2
    ): InstanceType<C2> => {
      if (InputClass === GivenClass) {
        const found = this.singletonCache.get(InputClass)
        if (found !== undefined) return found as any
        const instance = factory(this)
        this.singletonCache.set(InputClass, instance)
        return instance as any
      } else {
        return create(InputClass) as any
      }
    }
  }

  async bootstrap(
    providers: Array<ServiceProvider>,
    opts: { silent?: boolean } = {}
  ): Promise<void> {
    for (const provider of providers) {
      if (!opts.silent) {
        this.logger.info({
          tag: "register",
          msg: `[${provider.constructor.name}]`,
        })
      }

      await provider.register(this)
    }

    for (const provider of providers) {
      if (provider.boot) {
        const t0 = Date.now()

        if (!opts.silent) {
          this.logger.info({
            tag: "boot",
            msg: `[${provider.constructor.name}] start`,
          })
        }

        await provider.boot(this)
        const t1 = Date.now()

        if (!opts.silent) {
          this.logger.info({
            tag: "boot",
            msg: `[${provider.constructor.name}] finished`,
            elapse: t1 - t0,
          })
        }
      }
    }
  }
}
