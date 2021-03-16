const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentHomework extends Model {
 
}

StudentHomework.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 作业id
  homeworkId: Sequelize.INTEGER,
  // 结果
  result: Sequelize.INTEGER,
  // 学生选项
  studentAnswer: Sequelize.STRING(128),
}, {
  sequelize: db,
  tableName: 'student_homework'
})

module.exports = { StudentHomework }