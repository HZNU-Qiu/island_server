const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Department extends Model {
  /**
   * 创建一个系别
   */
  static async add(department) {
    return await Department.create({
      ...department
    })
  }

  /**
   * 编辑系别信息
   */
  static async modify(id, name) {
    return await Department.update({
      name: name
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 启用系别
   */
  static async activate(id) {
    return await Department.update({
      status: 1
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 禁用系别
   */
  static async ban(id) {
    return await Department.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }
}

Department.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 系别名称
  name: Sequelize.STRING(64),
  // 从属学院id
  schoolId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'department'
})

module.exports = { Department }
