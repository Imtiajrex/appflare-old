class Config {
  static instance: Config | null = null

  config: _APPFLARE_ENV | null = null
  constructor(env: _APPFLARE_ENV) {
    if (Config.instance) {
      return Config.instance
    }

    this.config = env
    Config.instance = this
  }
  static isStorageEnabled() {
    return !!Config.getInstance().config!.BUCKET
  }
  static isKVEnabled() {
    return !!Config.getInstance().config!.KV
  }

  static initialize(env: _APPFLARE_ENV) {
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
    return Config.instance
  }
}

export default Config
