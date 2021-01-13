const { HttpException } = require('../core/http-exception')
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.env === 'dev'
    // 如果当前环境为开发环境，就抛出异常
    if (!isHttpException && isDev) {
      throw error
    }
    if (isHttpException) {
      ctx.body = {
        message: error.message,
        code: error.code,
        data: error.data,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        // message: 'Unknown Error',
        message: error.message,
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError