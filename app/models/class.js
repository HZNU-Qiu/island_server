const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Class extends Model {
  /**
   * 创建班级
   */
  static async create(data) {
    return await Class.create({
      ...data
    })
  }

  /**
   * 编辑班级信息
   */
  static async modify(data) {
    return await Class.update({
      name: data.name,
      schoolId: data.schoolId
    }, {
      where: {
        id: data.id
      }
    })
  }

  /**
   * 启用班级
   */
  static async activate(id) {
    return await Class.update({
      status: 1
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 禁用班级
   */
  static async ban(id) {
    return await Class.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }
}

Class.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 班级名称
  name: Sequelize.STRING(64),
  // 从属专业id
  schoolId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'class'
})

module.exports = { Class }
