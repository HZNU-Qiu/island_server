const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Homework extends Model {
  /**
   * 教师布置作业时
   * 获取所有章节下的题目
   * @param current 页码
   */
  static async listExercise(current, chapterId) {
    let offset = (current - 1) * 20
    // 获取该章节下所有的练习题
    let sql1 = `SELECT c.category_id FROM course c JOIN chapter ON c.id = chapter.course_id WHERE chapter.id = ${chapterId}`
    let res1 = await db.query(sql1, { raw: true })
    let categoryId = res1[0][0].category_id
    const { Exercise } = require('../models/exercise')
    let res = await Exercise.findAndCountAll({
      where: {
        categoryId,
        status: 1
      },
      limit: 20,
      offset: offset
    })
    return res
  }

  /**
   * 教师布置作业时
   * 获取该章节所有的作业题目
   */
  static async listHomework(chapterId) {
    let sql1 = `SELECT e.id, e.type, e.difficulty, e.content, e.options, e.answer, e.hint, e.remark, h.id AS homeworkId
    FROM homework h LEFT JOIN exercise e ON h.exercise_id = e.id
    WHERE h.chapter_id = ${chapterId} GROUP BY h.id`
    let res1 = await db.query(sql1, { raw: true })
    res1[0].map((item) => {
      item.options = item.options.split(';')
    })
    return res1[0]
  }

  /**
   * 保存作业
   */
  static async saveHomework(data, chapterId) {
    if (data.length === 0) {
      await Homework.destroy({
        where: {
          chapterId
        },
        force: true
      })
    } else {
      let homework = await Homework.findAll({
        attributes: ["exerciseId", "chapterId"],
        where: {
          chapterId
        }
      })
      if (homework.length === 0) {
        return await Homework.bulkCreate(data)
      } else {
        let needToDelete = []
        let needToCreate = []
        homework.map((item) => {
          let flag = data.some((x) => {
            if (x.exerciseId === item.dataValues.exerciseId) {
              return true
            }
          })
          if (!flag) {
            needToDelete.push(item.dataValues)
          }
        })
        data.map((item) => {
          let flag = homework.some((x) => {
            if (item.exerciseId === x.dataValues.exerciseId) {
              return true
            }
          })
          if (!flag) {
            needToCreate.push(item)
          }
        })
        if (needToDelete.length !== 0) {
          needToDelete.map(async (item) => {
            await Homework.destroy({
              where: item,
              force: true
            })
          })
        }
        if (needToCreate.length !== 0) {
          await Homework.bulkCreate(needToCreate)
        }
      }
    }

  }

}

Homework.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 章节ID
  chapterId: Sequelize.INTEGER,
  // 理论练习ID
  exerciseId: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'homework'
})

module.exports = { Homework }