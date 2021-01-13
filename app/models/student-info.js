const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentInfo extends Model {

}

StudentInfo.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: {
    type: Sequelize.INTEGER,
    unique: true
  },
  // 学校id
  universityId: Sequelize.INTEGER,
  // 学院id
  schoolId: Sequelize.INTEGER,
  // 系别id
  departmentId: Sequelize.INTEGER,
  // 班级id
  classId: Sequelize.INTEGER,
  // 专业id
  majorId: Sequelize.INTEGER,
  // 理论能力值
  theoryAbility: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 实践能力值
  practiceAbility: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'student_info'
})

module.exports = { StudentInfo }