const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentInfo extends Model {
  /**
   * 新增学生用户信息
   */
  static async add(info) {
    return await StudentInfo.create({
      ...info
    })
  }

  /**
   * 编辑学生用户信息
   */
  static async modify(info) {
    await StudentInfo.update({
      ...info
    }, {
      where: {
        id: info.id
      }
    })
  }

  /**
   * 获取学生个人学籍信息
   */
  static async statusInfo(id) {
    let statusInfo = await db.query(`SELECT u.name AS universityName,sc.name AS schoolName, d.name AS departmentName, m.name AS majorName, c.name AS className
    FROM student_info s JOIN university u ON s.university_id = u.id
    JOIN school sc ON s.school_id = sc.id
    JOIN department d ON s.department_id = d.id
    JOIN major m ON s.major_id = m.id
    JOIN class c ON s.class_id = c.id
    WHERE s.user_id = ${id}`)
    return statusInfo
  }

  /**
   * 获取学生身份信息
   */
  static async getInfo(id) {
    let info = await db.query(`SELECT 
    u.username,u.realname,u.sex,u.email,u.avatar,u.open_id,s.theory_ability,s.practice_ability
    FROM user u JOIN student_info s ON u.id = s.user_id WHERE u.id = ${id}`)
    return info
  }

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