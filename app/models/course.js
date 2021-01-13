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
  // 创建者id
  creatorId: Sequelize.INTEGER,
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 难度
  difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 类别
  category: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 方向
  direction: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 学习人数
  learnedSum: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'course'
})

module.exports = { Course }
