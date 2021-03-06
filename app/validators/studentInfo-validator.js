const { LinValidator, Rule } = require('../../core/lin-validator')
const { StudentInfo } = require('../models/student-info')

class StudentInfoAddValidator extends LinValidator {
  constructor() {
    super()
    this.realName = [
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
    this.majorId = this.universityId
    this.classId = this.universityId
  }
}

class AddStudentValidator extends LinValidator {
  constructor() {
    super()
    this.realname = [
      new Rule('isLength', '真实姓名不能为空', { min: 1 })
    ]
    this.sex = [
      new Rule('isLength', '性别不能为空，且只有两种', { min: 1, max: 2 })
    ]
    this.username = [
      new Rule('isLength', '用户名不能为空', {min: 1})
    ]
    this.password1 = this.username
    this.email = this.username
    this.university_id = [
      new Rule('isLength', 'ID不能为空', { min: 1 })
    ]
    this.school_id = this.university_id
    this.department_id = this.university_id
    this.major_id = this.university_id
    this.class_id = this.university_id
  }
  async validateUsername(vals) {
    let username = vals.body.username
    const {User} = require('../models/user')
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
  StudentInfoAddValidator,
  AddStudentValidator,
}