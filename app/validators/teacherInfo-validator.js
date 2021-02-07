const { LinValidator, Rule } = require('../../core/lin-validator')
const { TeacherInfo } = require('../models/teacher-info')

class AddTeacherValidator extends LinValidator {
  constructor() {
    super()
    this.realname = [
      new Rule('isLength', '真实姓名不能为空', { min: 1 })
    ]
    this.sex = [
      new Rule('isLength', '性别不能为空，且只有两种', { min: 1, max: 2 })
    ]
    this.universityId = [
      new Rule('isLength', 'ID不能为空', { min: 1 })
    ]
    this.schoolId = this.universityId
    this.departmentId = this.universityId
  }
  async validateUsername(vals) {
    let username = vals.body.username
    const { User } = require('../models/user')
    let user = await User.findOne({
      where: {
        username: username
      }
    })
    if (user) {
      throw new Error('用户名已存在,请换一个')
    }
  }
}

module.exports = {
  AddTeacherValidator,

}