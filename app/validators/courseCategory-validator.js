const { LinValidator, Rule } = require('../../core/lin-validator')
const { CourseCategory } = require('../models/course-category')

class AddCourseCategoryValidator extends LinValidator {
  constructor() {
    super()
    this.tagName = [
      new Rule('isLength', '类别名称不能为空且不能多余16个字符', { min: 1, max: 16 })
    ]
    this.direction = [
      new Rule('isInt', '类别从属方向ID丢失', { min: 1 })
    ]
    this.iconImage = [
      new Rule('isLength', '类别图标地址丢失', { min: 5 })
    ]
  }
  async validateName(vals) {
    let name = vals.body.tagName
    let tag = await CourseCategory.findOne({
      where: {
        name: name
      }
    })
    if (tag) {
      throw new Error('该类别已存在')
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
    this.icon = [
      new Rule('isLength', '类别标签不能为空', { min: 5 })
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