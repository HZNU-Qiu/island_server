const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentHomework extends Model {
  /**
   * 学生提交作业保存记录
   */
  static async submitAndSave(data, userId) {
    let chapterId = data.chapterId
    let courseId = data.courseId
    let rightNum = 0, wrongNum = 0
    data.results.map((item) => {
      item.userId = userId
      if (parseInt(item.result) === 1) {
        rightNum++
      } else {
        wrongNum++
      }
    })
    let grade = 0, rate = rightNum / (rightNum + wrongNum)
    if (rate < 0.2) {
      grade = 4
    } else if (rate < 0.5) {
      grade = 3
    } else if (rate < 0.9) {
      grade = 2
    } else {
      grade = 1
    }
    let saveData = {}
    saveData.userId = userId
    saveData.chapterId = chapterId
    saveData.courseId = courseId
    saveData.grade = grade
    const { StudentChapter } = require('./student-chapter')
    await Promise.all([StudentChapter.create({ ...saveData }), StudentHomework.bulkCreate(data.results)])
    let resData = {}
    resData.grade = grade
    resData.rightNum = rightNum
    resData.wrongNum = wrongNum
    return resData;
  }

  /**
   * 获取学生作业记录
   */
  static async getStudentHomeworkRecord(chapterId, userId) {
    let sql = `SELECT s.* 
    FROM student_homework s JOIN homework h ON s.homework_id = h.id
    WHERE s.user_id = ${userId} AND h.chapter_id = ${chapterId}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }
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