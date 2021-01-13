const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseCategory extends Model {

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
  status: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'category'
})

module.exports = { CourseCategory }