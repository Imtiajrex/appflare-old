import app from './app'
import Config, { AppflareEnv } from './lib/config'
import { Result } from 'neverthrow'

declare global {
  type ResultType<T> = Result<T, string>
  type _APPFLARE_ENV = AppflareEnv
}

export const server = async (request: Request, _env: _APPFLARE_ENV) => {
  Config.initialize(_env)

  return app.fetch(request)
}
export { MongoDurableObject as DBObject } from './lib/mongo/do'
