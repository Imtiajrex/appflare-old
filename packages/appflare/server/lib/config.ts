export type AppflareEnv = {
  MONGO_URI: string
  MONGO_DB: string
  BUCKET?: R2Bucket
  KV?: KVNamespace
  DURABLE_OBJECT?: DurableObjectNamespace
  STRIPE_SECRET_KEY: string
  STRIPE_SIGNING_SECRET: string
  CF?: CfProperties<any>
}
class Config {
  static instance: Config | null = null

  config: AppflareEnv | null = null
  constructor(env: AppflareEnv) {
    if (Config.instance) {
      return Config.instance
    }

    this.config = env
    Config.instance = this
  }
  static isStorageEnabled() {
    return !!Config.getInstance()!.BUCKET
  }
  static isKVEnabled() {
    return !!Config.getInstance()!.KV
  }

  static initialize(env: AppflareEnv) {
    if (!Config.instance) {
      new Config(env)
    }
    return Config.instance
  }

  static getInstance() {
    if (!Config.instance) {
      throw new Error(
        'Config not initialized. Call Config.initialize(env) first.',
      )
    }
    return Config.instance.config
  }
}

export default Config
