class Configs {
  config: Env
  constructor(_config: Env) {
    this.config = _config
  }
}
class Config {
  static instance: Config | null = null

  config: Env
  constructor(env: Env) {
    if (Config.instance) {
      return Config.instance
    }

    this.config = env
    Config.instance = this
  }

  static initialize(env) {
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
