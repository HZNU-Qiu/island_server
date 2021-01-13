const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Major extends Model {

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
