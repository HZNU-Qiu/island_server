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

module.exports = {
  StudentInfoAddValidator,
  
}