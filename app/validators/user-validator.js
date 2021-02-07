const { LinValidator, Rule } = require('../../core/lin-validator')
const { User } = require('../models/user')

/**
 * 用户请求校验器
 */
class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.pass = [
      new Rule('isLength', '密码长度为6~18个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码至少1个大写字母，1个小写字母和一个数字', /^[\w_-]{6,16}$/)
    ]
    // 这里是相同的规则
    this.checkpass = this.pass1
    this.username1 = [
      new Rule('isLength', '用户名长度为2-32个字符', { min: 2, max: 32 })
    ]
  }

  // 校验两次密码是否相同
  validatePassword(vals) {
    const pwd1 = vals.body.pass
    const pwd2 = vals.body.checkpass
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该email已被注册!')
    }
  }

  async validateUsername(vals) {
    const username = vals.body.username1
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    // 如果邮箱存在
    if (user) {
      throw new Error('该用户名已被注册!')
    }
  }
}

/**
 * 登录校验器
 */
class LoginValidator extends LinValidator {
  constructor() {
    super()
    this.username = [
      new Rule('isLength', '非法用户名', { min: 2, max: 32 })
    ]
    this.password = [
      new Rule('isLength', '密码不能为空', { min: 1 })
    ]
  }
}

/**
 * 用户信息获取校验器
 */
class GetInfoValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isLength', 'id不能为空', { min: 1 })
    ]
    this.type = [
      new Rule('isLength', 'type不能为空', { min: 1 })
    ]
  }
}

/**
 * 学生信息编辑校验器
 */
class ModifyStudentInfo extends LinValidator {
  constructor() {
    super()
    this.realname = [
      new Rule('isLength', '真实姓名不能为空', { min: 1 })
    ]
    this.sex = [
      new Rule('isLength', 'sex不能为空', { min: 1, max: 2 })
    ]
    this.email = [
      new Rule('isEmail', 'Email不合法')
    ]
  }
}

module.exports = {
  RegisterValidator,
  LoginValidator,
  GetInfoValidator,
  ModifyStudentInfo,
  
}