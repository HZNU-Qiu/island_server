const { LinValidator, Rule } = require('../../core/lin-validator')
const { Course } = require('../models/course')

class AddCourseValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '课程名称不能为空且不能多余32个字符', { min: 1, max: 32 })
    ]
    this.description = [
      new Rule('isLength', '课程描述不能为空', { min: 1 })
    ]
    this.difficulty = [
      new Rule('isInt', '课程难度不能为空或不规范', { min: 1, max: 3 })
    ]
    this.notice = [
      new Rule('isLength', '课程须知不能为空', { min: 1 })
    ]
    this.objectives = [
      new Rule('isLength', '课程目标不能为空', { min: 1 })
    ]
    this.directionId = [
      new Rule('isInt', '课程方向不能为空或不规范', { min: 1 })
    ]
    this.categoryId = [
      new Rule('isInt', '课程类别不能为空', { min: 1 })
    ]
  }
  async validateName(vals) {
    let name = vals.body.name
    let direction = await Course.findOne({
      where: {
        name: name
      }
    })
    if (direction) {
      throw new Error('该方向已存在')
    }
  }
}


module.exports = {
  AddCourseValidator,
}