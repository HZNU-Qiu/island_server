const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ClassRoom extends Model {
  /**
   * 创建班级
   */
  static async add(data) {
    return await ClassRoom.create({
      ...data
    })
  }

  /**
   * 编辑班级信息
   */
  static async modify(id, name) {
    return await ClassRoom.update({
      name: name
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 启用班级
   */
  static async activate(id) {
    return await ClassRoom.update({
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
    return await ClassRoom.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }
}

ClassRoom.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 班级名称
  name: Sequelize.STRING(64),
  // 从属专业id
  majorId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'class'
})

module.exports = { ClassRoom }
