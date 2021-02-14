const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Course extends Model {

}

Course.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 课程名称
  name: Sequelize.STRING(64),
  // 课程描述
  description: Sequelize.STRING(255),
  // 课程难度
  difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 课程综合评分
  point: {
    type: Sequelize.FLOAT(3, 2),
    defaultValue: 0.00
  },
  // 课程须知
  notice: Sequelize.STRING(255),
  // 课程目标
  objectives: Sequelize.STRING(255),
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 创建者id
  creatorId: Sequelize.INTEGER,
  // 类别
  categoryId: Sequelize.INTEGER,
  // 方向
  directionId: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'course'
})

module.exports = { Course }
