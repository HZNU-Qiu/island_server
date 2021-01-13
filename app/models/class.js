const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Class extends Model {

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
