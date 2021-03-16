const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class AttendExam extends Model {
 
}

AttendExam.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 成绩
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 考试id
  examId: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'attend_exam'
})

module.exports = { AttendExam }