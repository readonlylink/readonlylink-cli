import { test } from "../../../ut/test"
import { App } from "./example-app"
import * as Providers from "./example-providers"
import { Logger, Resource } from "./example-providers"

const app = new App()

const providers = [
  new Providers.LoggerProvider(),
  new Providers.DbResourceProvider(),
]

test("bootstrap", async () => {
  await app.bootstrap(providers)

  app.create(Logger).log("create Logger ok")
  app.create(Resource).logger.log("create Resource ok")
})
