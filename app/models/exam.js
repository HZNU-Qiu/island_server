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