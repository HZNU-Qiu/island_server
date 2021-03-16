const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exam extends Model {
 
}

Exam.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 题目分数
  paperId: Sequelize.INTEGER,
  // 练习id
  startTime: Sequelize.DATE,
  // 试卷id
  endTime: Sequelize.DATE,
}, {
  sequelize: db,
  tableName: 'exam'
})

module.exports = { Exam }