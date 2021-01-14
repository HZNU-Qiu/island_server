const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseDirection extends Model {
  /**
   * 创建学科方向
   */
  static async create(direction) {
    return await CourseDirection.create({
      ...direction
    })
  }

  /**
   * 编辑学科方向
   */
  static async modify(id, name) {
    return await CourseDirection.update({
      name
    }, {
      id
    })
  }

  /**
   * 启用学科方向
   */
  static async activate(id) {
    return await CourseDirection.update({
      status: 1
    }, {
      id
    })
  }

  /**
   * 禁用学科方向
   */
  static async ban(id) {
    return await CourseDirection.update({
      status: 0
    }, {
      id
    })
  }

  /**
   * 展示所有学科方向(分页)
   * 未完成！！！
   */
  static async listByPage(offset) {
    return await CourseDirection.findAll({ offset, limit: 10 })
  }
}

CourseDirection.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 方向名称
  name: Sequelize.STRING(64),
  // 方向描述
  description: {
    type: Sequelize.STRING(128),
    defaultValue: '这是一个很有前途的方向'
  },
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'direction'
})

module.exports = { CourseDirection }