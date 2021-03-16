const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ExamRecord extends Model {
 
}

ExamRecord.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 考试id
  examId: Sequelize.INTEGER,
  // 练习题id
  exerciseId: Sequelize.INTEGER,
  // 结果
  result: Sequelize.INTEGER,
  // 学生选项
  studentAnswer: Sequelize.STRING(128),
}, {
  sequelize: db,
  tableName: 'exam_record'
})

module.exports = { ExamRecord }