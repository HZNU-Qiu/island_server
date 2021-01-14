const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseCategory extends Model {
  /**
   * 创建一个课程的类别
   */
  static async create(data) {
    return await CourseCategory.create({
      ...data
    })
  }

  /**
   * 编辑课程类别
   */
  static async modify(data) {
    return await CourseCategory.update({
      ...data
    }, {
      id: data.id
    })
  }

  /**
   * 禁用课程类别
   */
  static async ban(id) {
    return await CourseCategory.update({
      status: 0
    }, {
      id
    })
  }

  /**
   * 启用课程类别
   */
  static async activate(id) {
    return await CourseCategory.update({
      status: 1
    }, {
      id
    })
  }
}

CourseCategory.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 类别名称
  name: Sequelize.STRING(64),
  // 所属方向
  direction: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // icon路径
  icon: {
    type: Sequelize.STRING(256),
    defaultValue: '/unknown.png'
  }
}, {
  sequelize: db,
  tableName: 'category'
})

module.exports = { CourseCategory }