const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseDirection extends Model {

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
  // 启用标识
  status: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'direction'
})

module.exports = { CourseDirection }