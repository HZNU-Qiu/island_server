const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const Op = Sequelize.Op

class School extends Model {
  /**
   * 创建学院
   */
  static async add(school) {
    return await School.create({
      ...school
    })
  }

  /**
   * 修改学院信息
   * @param id
   * @param name 学院名称
   */
  static async modify(id, name) {
    return await School.update({
      name: name
    }, {
      where: {
        id: id
      }
    })
  }

  /**
   * 禁用学院
   * @param id 学院id
   */
  static async ban(id) {
    return await School.update({
      status: 0
    }, {
      id
    })
  }

  /**
   * 禁用学院
   * @param id 学院id
   */
  static async activate(id) {
    return await School.update({
      status: 1
    }, {
      id
    })
  }

  /**
   * 查询相关学院列表
   * @param name 学院名称
   */
  static async queryAndList(name) {
    if (name) {
      return await School.findAll({
        where: {
          name: {
            [Op.substring]: name
          }
        }
      })
    } else {
      return await School.findAll()
    }
  }

  /**
   * 
   */
}

School.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学院名称
  name: Sequelize.STRING(64),
  // 从属学校id
  universityId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'school'
})

module.exports = { School }
