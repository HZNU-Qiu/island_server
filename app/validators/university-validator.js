const { LinValidator, Rule } = require('../../core/lin-validator')
const { University } = require('../models/university')
const { School } = require('../models/school')
const { Department } = require('../models/department')
const { Major } = require('../models/major')
const { ClassRoom } = require('../models/class')

class UniversityAddValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '院校名称不能为空', { min: 2 })
    ]
  }
  async validateName(vals) {
    const name = vals.body.name
    const university = await University.findOne({
      where: {
        name: name
      }
    })
    if (university) {
      throw new Error('学校名称重复')
    }
  }
}

class SchoolAddValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '学院名称不能为空', { min: 2 })
    ]
    this.universityId = [
      new Rule('isLength', '隶属学校ID不能为空', { min: 1 })
    ]
  }
  async validateSchoolName(vals) {
    const name = vals.body.name
    const school = await School.findOne({
      where: {
        name: name
      }
    })
    if (school) {
      throw new Error('该学院已存在')
    }
  }
}

class DepartmentAddValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '系别名称不能为空', { min: 2 })
    ]
    this.schoolId = [
      new Rule('isLength', '隶属学校id不能为空', { min: 1 })
    ]
  }
  async validateDepartmentName(vals) {
    let name = vals.body.name
    let department = await Department.findOne({
      where: {
        name: name
      }
    })
    if (department) {
      throw new Error('该系别已经存在')
    }
  }
}

class MajorAddValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '系别名称不能为空', { min: 2 })
    ]
    this.departmentId = [
      new Rule('isLength', '隶属系别id不能为空', { min: 1 })
    ]
  }
  async validateMajorName(vals) {
    let name = vals.body.name
    let major = await Major.findOne({
      where: {
        name: name
      }
    })
    if (major) {
      throw new Error('该系别已经存在')
    }
  }
}

class ClassAddValidator extends LinValidator {
  constructor() {
    super()
    this.name = [
      new Rule('isLength', '系别名称不能为空', { min: 2 })
    ]
    this.majorId = [
      new Rule('isLength', '隶属专业id不能为空', { min: 1 })
    ]
  }
  async validateClassName(vals) {
    let name = vals.body.name
    let data = await ClassRoom.findOne({
      where: {
        name: name
      }
    })
    if (data) {
      throw new Error('该系别已经存在')
    }
  }
}

class ModifyValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isLength', 'id不能为空', { min: 1 })
    ]
    this.name = [
      new Rule('isLength', 'name不能空', { min: 2 })
    ]
  }
}

class UniversityNameModifyValidator extends ModifyValidator {
  constructor() {
    super()
  }
  async validateUniversityName(vals) {
    const name = vals.body.name
    const university = await University.findOne({
      where: {
        name: name
      }
    })
    if (university) {
      throw new Error('该名称已被使用')
    }
  }
}

class SchoolNameModifyValidator extends ModifyValidator {
  constructor() {
    super()
  }
  async validateSchoolName(vals) {
    const name = vals.body.name
    const school = await School.findOne({
      where: {
        name: name
      }
    })
    if (school) {
      throw new Error('该名称已被使用')
    }
  }
}

class DepartmentNameModifyValidator extends ModifyValidator {
  constructor() {
    super()
  }
  async validateSchoolName(vals) {
    const name = vals.body.name
    const department = await Department.findOne({
      where: {
        name: name
      }
    })
    if (department) {
      throw new Error('该名称已被使用')
    }
  }
}

class MajorNameModifyValidator extends ModifyValidator {
  constructor() {
    super()
  }
  async validateSchoolName(vals) {
    const name = vals.body.name
    const major = await Major.findOne({
      where: {
        name: name
      }
    })
    if (major) {
      throw new Error('该名称已被使用')
    }
  }
}

class ClassNameModifyValidator extends ModifyValidator {
  constructor() {
    super()
  }
  async validateSchoolName(vals) {
    const name = vals.body.name
    const clas = await ClassRoom.findOne({
      where: {
        name: name
      }
    })
    if (clas) {
      throw new Error('该名称已被使用')
    }
  }
}

module.exports = {
  UniversityAddValidator,
  SchoolAddValidator,
  DepartmentAddValidator,
  MajorAddValidator,
  ClassAddValidator,
  UniversityNameModifyValidator,
  SchoolNameModifyValidator,
  DepartmentNameModifyValidator,
  MajorNameModifyValidator,
  ClassNameModifyValidator,

}