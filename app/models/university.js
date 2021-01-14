const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const Op = Sequelize.Op

class University extends Model {
  /**
   * 创建学校
   */
  static async create(university) {
    return await University.create({
      ...university
    })
  }

  /**
   * 编辑学校信息
   */
  static async modify(university) {
    return await this.update({
      ...university
    }, {
      where: {
        id: university.id
      }
    })
  }

  /**
   * 展示所有学校
   * @param keywords 关键词
   */
  static async queryAndList(keywords) {
    if (keywords) {
      return await University.findAll({
        where: {
          [Op.or]: {
            name: {
              [Op.substring]: keywords
            },
            acronym: {
              [Op.substring]: keywords
            }
          }
        }
      })
    } else {
      return await University.findAll()
    }
  }

  /**
   * 删除学校信息
   * @param id 学校id
   * 待完成！！！
   */
  static async kill(id) {

  }
}

University.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学校名称
  name: Sequelize.STRING(64),
  acronym: Sequelize.STRING(32)
}, {
  sequelize: db,
  tableName: 'university'
})

module.exports = { University }
