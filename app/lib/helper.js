/**
 * success 响应构造器
 * @param message
 * @param data
 */
function success(message, data) {
  throw new global.errs.Success(message, data)
}

/**
 * error响应构造器
 * @param message 响应消息
 * @param data 响应数据
 */
function error(message, data) {
	throw new global.errs.HttpException(message, data)
}

/**
 * 根据不同判题返回码响应信息
 */
function responseByResult(result) {
	let response = 'Unknown Error!'
	if (result === 0) {
		return response = 'ANSWER ACCEPTED'
	}
	switch (result) {
		case -1:
			response = 'WRONG ANSWER'
			break
		case 1:
			response = 'CPU TIME LIMIT EXCEEDED'
			break
		case 2:
			response = 'TIME LIMIT_EXCEEDED'
			break
		case 3:
			response = 'TIME LIMIT EXCEEDED'
			break
		case 4:
			response = 'RUNTIME ERROR'
			break
		case 5:
			response = 'SYSTEM ERROR'
			break
		default: 
			break
	}
	return response
}

module.exports = {
	success,
  error,
  responseByResult,
}