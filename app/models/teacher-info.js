const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class TeacherInfo extends Model {
  /**
   * 新增教师信息
   */
  static async add(info) {
    return await TeacherInfo.create({
      ...info
    })
  }

  /**
   * 编辑教师信息
   */
  static async modify(info) {
    await TeacherInfo.update({
      ...info
    }, {
      where: {
        user_id: info.id
      }
    })
  }

  /**
   * 获取教师身份信息
   */
  static async getInfo(id) {
    let info = await db.query(`SELECT 
    u.username,u.realname,u.sex,u.email,u.avatar,u.open_id,t.popularity
    FROM user u JOIN teacher_info t ON u.id = t.user_id WHERE u.id = ${id}`)
    return info
  }

  /**
   * 获取学生个人学籍信息
   */
  static async statusInfo(id) {
    let statusInfo = await db.query(`SELECT u.name AS universityName,sc.name AS schoolName, d.name AS departmentName, m.name AS majorName, c.name AS className
    FROM teacher_info t JOIN university u ON t.university_id = u.id
    JOIN school sc ON t.school_id = sc.id
    JOIN department d ON t.department_id = d.id
    WHERE t.user_id = ${id}`)
    return statusInfo
  }
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