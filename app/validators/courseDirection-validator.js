const { LinValidator, Rule } = require('../../core/lin-validator')
const { CourseDirection } = require('../models/course-direction')

class AddCourseDirectionValidator extends LinValidator {
  constructor() {
    super()
    this.directionName = [
      new Rule('isLength', '方向名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.directionDesc = [
      new Rule('isLength', '方向名称不能为空且不能多余24个字符', { min: 1, max: 24 })
    ]
  }
  async validateName(vals) {
    let name = vals.body.directionName
    let direction = await CourseDirection.findOne({
      where: {
        name: name
      }
    })
    if (direction) {
      throw new Error('该方向已存在')
    }
  }
}

class ModifyCourseDirectionValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', 'ID必须为正整数', { min: 1 })
    ]
    this.directionName = [
      new Rule('isLength', '方向名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.directionDesc = [
      new Rule('isLength', '方向名称不能为空且不能多余24个字符', { min: 1, max: 24 })
    ]
  }
}

module.exports = {
  AddCourseDirectionValidator,
  ModifyCourseDirectionValidator,
  
}