const { LinValidator, Rule } = require('../../core/lin-validator')
const { CourseCategory } = require('../models/course-category')

class AddCourseCategoryValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '类别名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.description = [
      new Rule('isLength', '类别描述不能为空且不能多余24个字符', { min: 1, max: 24 })
    ]
  }
  async validateName(vals) {
    let name = vals.body.directionName
    let tag = await CourseCategory.findOne({
      where: {
        name: name
      }
    })
    if (tag) {
      throw new Error('该方向已存在')
    }
  }
}

class ModifyCourseCategoryValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', 'ID必须为正整数', { min: 1 })
    ]
    this.name = [
      new Rule('isLength', '类别名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.description = [
      new Rule('isLength', '类别描述不能为空且不能多余24个字符', { min: 1, max: 24 })
    ]
  }
}

class ListTagsValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', 'ID需为正整数', { min: 1 })
    ]
  }
}

module.exports = {
  AddCourseCategoryValidator,
  ModifyCourseCategoryValidator,
  ListTagsValidator,
  
}