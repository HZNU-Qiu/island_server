const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ExerciseCollection extends Model {
 
}

ExerciseCollection.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 章节id
  exerciseId: Sequelize.INTEGER,
  // 手记
  remark: Sequelize.TEXT,
}, {
  sequelize: db,
  tableName: 'exercise_collection'
})

module.exports = { ExerciseCollection }