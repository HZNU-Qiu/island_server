const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exam extends Model {
  /**
   * 保存考试
   */
  static async saveExam(data) {
    return await Exam.create({
      ...data
    })
  }

  /**
   * 编辑考试
   */
  static async modifyExam(data) {
    return await Exam.update({
      ...data
    }, {
      where: { id: data.id }
    })
  }

  /**
   * 获取教师创建的考试
   */
  static async getTeachersExam(creatorId) {
    let data = await Exam.findAndCountAll({
      where: {
        creatorId
      }
    })
    let currentTime = new Date().getTime();
    data.rows.map((item) => {
      let startTimestamp = new Date(item.startTime)
      let endTimestamp = new Date(item.endTime)
      if (currentTime < startTimestamp) {
        item.dataValues.status = 0
      } else if (currentTime > startTimestamp && currentTime < endTimestamp) {
        item.dataValues.status = 1
      } else {
        item.dataValues.status = 2
      }
    })
    return data
  }

  /**
   * 获取当前学生所学课程的考试
   */
  static async listStudentExams(userId) {
    const { StudentCourse } = require('./student-course')
    let courses = await StudentCourse.findAll({
      attributes: ['courseId']
      , where: {
        studentId: userId
      }
    })
    let courseIds = []
    courses.map((item) => {
      courseIds.push(item.courseId)
    })
    let sql = `SELECT e.id, e.name, e.course_id AS courseId, e.paper_id AS paperId, date_format(e.start_time, '%Y-%m-%d %H:%i:%s') AS startTime, date_format(e.end_time, '%Y-%m-%d %H:%i:%s') AS endTime
    FROM exam e WHERE e.course_id in (${courseIds})`
    let res = await db.query(sql, { raw: true })
    let exams = res[0]
    // 获取学生已报名的考试
    const { AttendExam } = require('./attend-exam')
    let hasAttend = await AttendExam.findAll({
      where: {
        userId
      }
    })
    exams.map(x => {
      x.hasJoined = false
      let startTimestamp = new Date(x.startTime)
      let endTimestamp = new Date(x.endTime)
      let currentTime = new Date().getTime();
      if (currentTime < startTimestamp) {
        x.status = 0
      } else if (currentTime > startTimestamp && currentTime < endTimestamp) {
        x.status = 1
      } else {
        x.status = 2
      }
      hasAttend.map(y => {
        if (x.id === y.examId) {
          x.hasJoined = true
        }
      })
    })
    return exams
  }
}

Exam.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 考试名称
  name: Sequelize.STRING,
  // 创建者id
  creatorId: Sequelize.INTEGER,
  // 课程id
  courseId: Sequelize.INTEGER,
  // 试卷id
  paperId: Sequelize.INTEGER,
  // 开始时间
  startTime: Sequelize.DATE,
  // 结束时间
  endTime: Sequelize.DATE,
}, {
  sequelize: db,
  tableName: 'exam'
})

module.exports = { Exam }