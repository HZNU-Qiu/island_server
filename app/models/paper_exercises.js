const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class PaperExercises extends Model {
 
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