const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Department extends Model {

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
