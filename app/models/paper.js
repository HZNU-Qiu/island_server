const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Paper extends Model {
 
}

Paper.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 卷头
  title: Sequelize.STRING(128),
  // 试卷类型 1-正式 2-模拟
  type: Sequelize.INTEGER,
  // 状态 0-草稿 1-发布
  status: Sequelize.INTEGER,
  // 创建者ID
  creatorId: Sequelize.INTEGER,
  // 总分
  point: Sequelize.INTEGER,
  // 课程id
  courseId: Sequelize.INTEGER,
  // 难度
  difficulty: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'paper'
})

module.exports = { Paper }