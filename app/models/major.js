const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Major extends Model {
  /**
   * 创建一个专业
   */
  static async create(major) {
    return await Major.create({
      ...major
    })
  }

  /**
   * 编辑专业信息
   */
  static async update(major) {
    return await Major.update({
      name: major.name,
      departmentId: major.departmentId
    }, {
      where: {
        id: major.id
      }
    })
  }

  /**
   * 启用专业
   */
  static async activate(id) {
    return await Major.update({
      status: 1
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 禁用专业
   */
  static async ban(id) {
    return await Major.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }
}

Major.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 专业名称
  name: Sequelize.STRING(64),
  // 从属系别id
  departmentId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'major'
})

module.exports = { Major }
