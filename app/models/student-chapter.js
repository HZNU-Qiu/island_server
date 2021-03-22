const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const Op = Sequelize.Op

class StudentChapter extends Model {
  /**
   * 获取学生学习进度
   */
  static async getProgress(studentId, courseId) {
    // 获取该课程共有多少节课
    const { Chapter } = require('./chapter')
    let chaptersTotal = await Chapter.count({
      where: {
        courseId,
        parentId: {
          [Op.ne]: -1
        }
      }
    })
    // 获取学生已经学习的章节
    let hasStudied = await StudentChapter.findAndCountAll({
      where: {
        userId: studentId,
        courseId
      }
    })
    let ATotal = 0, BTotal = 0, CTotal = 0, DTotal = 0
    hasStudied.rows.map((item) => {
      switch (item.grade) {
        case 1:
          ATotal++
          break
        case 2:
          BTotal++
          break
        case 3:
          CTotal++
          break
        case 4:
          DTotal++
        default:
          break
      }
    })
    let res = {}
    res.chaptersTotal = chaptersTotal
    res.ATotal = ATotal
    res.BTotal = BTotal
    res.CTotal = CTotal
    res.DTotal = DTotal
    res.hasStudied = hasStudied
    return res
  }

  /**
   * 查询学生是否完成了该章节
   * 是返回成绩
   */
  static async hasComplete(chapterId, userId) {
    return await StudentChapter.findOne({
      where: {
        userId,
        chapterId
      }
    })
  }
}

StudentChapter.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 课程id
  courseId: Sequelize.INTEGER,
  // 章节id
  chapterId: Sequelize.INTEGER,
  // 成绩 1-A 2-B 3-C 4-D
  grade: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'student_chapter'
})

module.exports = { StudentChapter }