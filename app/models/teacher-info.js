const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class TeacherInfo extends Model {

}

TeacherInfo.init({
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
  // 人气值(指导过的学生数)
  popularity: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'teacher_info'
})

module.exports = { TeacherInfo }