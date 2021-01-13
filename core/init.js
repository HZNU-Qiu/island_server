const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  // 入口方法
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }
  // 加载配置文件
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  // 静态方法，用于加载所有所有路由
  static initLoadRouters() {
    const apiDir = `${process.cwd()}/app/api`
    requireDirectory(module, apiDir, {
			visit: whenLoadModule
		})

		function whenLoadModule(mod) {
			if (mod instanceof Router) {
				InitManager.app.use(mod.routes())
			}
		}
  }

  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }

}

module.exports = InitManager