const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class AttendExam extends Model {
  /**
   * 获取该学生的所有成绩，并统计各个分段的次数
   */
  static async getStudentGrade(userId) {
    // 获取学生成绩
    let sql = `SELECT r.grade, e.name 
    FROM attend_exam r LEFT JOIN exam e ON r.exam_id = e.id
    WHERE r.user_id = ${userId}`
    let res = await db.query(sql, { raw: true })
    let grades = res[0]
    let gradesdemographic = {}
    // 统计分数阶段
    grades.map(x => {
      if (gradesdemographic.hasOwnProperty(x.grade)) {
        gradesdemographic[x.grade] ++
      } else {
        gradesdemographic[x.grade] = 1
      }
    })
    let chartData = {
      hoverBackgroundColor: "red",
      hoverBorderWidth: 10,
      labels: Object.keys(gradesdemographic),
      datasets: [
        {
          label: "Data One",
          backgroundColor: [
            "#41B883",
            "#E46651",
            "#00D8FF",
            "#ffc107",
            "#673ab7",
            "#ff5722",
          ],
          data: Object.values(gradesdemographic),
        },
      ],
    }
    let resData = {}
    resData.grades = grades
    resData.chartData = chartData
    return resData
  }
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