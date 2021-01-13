class HttpException extends Error {
  constructor(message = 'Server Exception', errorCode = 10000, code = 500) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.message = message
  }
}

class ParameterException extends HttpException {
  constructor(message, errorCode) {
    super()
    this.code = 400
    this.message = message || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

/**
 * 成功响应
 */
class Success extends HttpException {
	constructor(message = null, data) {
		super()
		this.code = 200
		this.message = message || 'ok'
		this.data = data || null
	}
}

/**
 * 无法访问异常
 */
class NotFound extends HttpException {
	constructor(message, errorCode) {
		super()
		this.message = message || '资源未找到'
		this.errorCode = errorCode || 10000
		this.code = 404
	}
}

/**
 * 认证授权异常
 */
class AuthFailed extends HttpException {
	constructor(message, errorCode) {
		super()
		this.message = message || '授权失败'
		this.errorCode = errorCode || 10004
		this.code = 401
	}
}

/**
 * 禁止访问
 */
class Forbidden extends HttpException {
	constructor(message, errorCode) {
		super()
		this.message = message || '禁止访问'
		this.errorCode = errorCode || 10006
		this.code = 403
	}
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  Forbidden,
	AuthFailed,
}