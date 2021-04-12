const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentCourse extends Model {
  /**
   * 筛选学生已添加的课程
   */
  static async filterMyCourse(data) {
    let current = data.current;
    let offset = (current - 1) * 20;
    let directionId = data.directionId;
    let categoryId = data.categoryId;
    let difficulty = data.difficulty;
    let studentId = data.studentId;
    let queryArr = [], queryCMD = ""
    if (directionId !== -1) {
      queryArr.push(`c.direction_id = ${directionId}`)
    }
    if (categoryId !== -1) {
      queryArr.push(`c.category_id = ${categoryId}`)
    }
    if (difficulty !== -1) {
      queryArr.push(`c.difficulty = ${difficulty}`)
    }
    queryArr.push(`s.student_id = ${studentId}`)
    queryCMD = queryArr.join(' AND ')
    queryCMD = "WHERE " + queryCMD
    let sql = `SELECT c.*, (SELECT COUNT(1) FROM student_course s ${queryCMD}) AS total
    FROM course c LEFT JOIN student_course s ON c.id = s.course_id
    ${queryCMD}
    LIMIT 20 OFFSET ${offset}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }

  /**
   * 学生开始学习课程
   */
  static async startLearning(data) {
    let rec = await StudentCourse.findOne({
      where: {
        ...data
      }
    })
    let flag
    if (rec !== null && rec !== "") {
      return flag = -1
    }
    await StudentCourse.create({
      ...data
    })
    return flag = 1
  }

  /**
   * 查询是否开启课程
   */
  static async hasStart(courseId, studentId) {
    let res = await StudentCourse.findOne({
      where: {
        courseId,
        studentId
      }
    })
    if (res !== null) {
      return true
    } else {
      return false
    }
  }
}

StudentCourse.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学生id
  studentId: Sequelize.INTEGER,
  // 课程id
  courseId: Sequelize.INTEGER,
  // 课程成绩
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 对课程评分
  commentToCourse: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'student_course'
})

module.exports = { StudentCourse }