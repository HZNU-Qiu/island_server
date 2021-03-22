const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ExamRecord extends Model {
  /**
   * 保存学生考试记录
   */
  static async saveRecord(data) {
    let record = await ExamRecord.findOne({
      where: {
        userId: data.userId,
        examId: data.examId,
        exerciseId: data.exerciseId
      }
    })
    if (record) {
      await ExamRecord.update({
        ...data
      }, {
        where: {
          id: record.id
        }
      })
    } else {
      await ExamRecord.create({
        ...data
      })
    }
  }

  /**
   * 批改试卷，反馈分数
   */
  static async judgeAndReturnGrade(data) {
    // 获取考试试卷的所有题目
    let sql1 = `SELECT e.*, p.point 
    FROM exercise e RIGHT JOIN paper_exercises p ON e.id = p.exercise_id
    WHERE p.paper_id = ${data.paperId}`
    let res1 = await db.query(sql1, { raw: true })
    let exercises = res1[0]
    // 获取学生答题记录
    let studentRecords = await ExamRecord.findAll({
      where: {
        userId: data.userId,
        examId: data.examId,
      }
    })
    // 批改试卷得到分数
    let total = 0
    studentRecords.map(record => {
      exercises.map(ex => {
        if (ex.id === record.exerciseId) {
          if (ex.answer === record.studentAnswer) {
            total += ex.point
          }
        }
      })
    })
    // 存入学生参加考试数据
    let attendData = {}
    attendData.userId = data.userId
    attendData.examId = data.examId
    attendData.grade = total
    const { AttendExam } = require('./attend-exam')
    await AttendExam.create({
      ...attendData
    })
  }
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