import Config from '@appflare/config'
import { drizzle } from 'drizzle-orm/d1'

export const initializeDB = () => {
  const { config } = Config.getInstance()
  return drizzle(config.DB)
}

export * from './schema'
