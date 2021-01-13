const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class School extends Model {

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
