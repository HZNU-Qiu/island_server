const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class PaperExercises extends Model {
  /**
   * 试题保存
   */
  static async savePaperExercise(data, paperId) {
    if (data.length === 0) {
      await PaperExercises.destroy({
        where: {
          paperId
        },
        force: true
      })
    } else {
      let paperExercises = await PaperExercises.findAll({
        attributes: ["exerciseId", "paperId"],
        where: {
          paperId
        }
      })
      if (paperExercises.length === 0) {
        return await PaperExercises.bulkCreate(data)
      } else {
        let needToDelete = []
        let needToCreate = []
        paperExercises.map((item) => {
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
          let flag = paperExercises.some((x) => {
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
            await PaperExercises.destroy({
              where: item,
              force: true
            })
          })
        }
        if (needToCreate.length !== 0) {
          await PaperExercises.bulkCreate(needToCreate)
        }
      }
    }
  }
}

PaperExercises.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 题目分数
  point: Sequelize.INTEGER,
  // 练习id
  exerciseId: Sequelize.INTEGER,
  // 试卷id
  paperId: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'paper_exercises'
})

module.exports = { PaperExercises }