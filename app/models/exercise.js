const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exercise extends Model {

}

Exercise.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 创建者ID
  creatorId: Sequelize.INTEGER,
  // 题目类型
  type: Sequelize.INTEGER,
  // 题目难度
  difficulty: Sequelize.INTEGER,
  // 所属方向ID
  directionId: Sequelize.INTEGER,
  // 所属类别ID
  categoryId: Sequelize.INTEGER,
  // 题干信息
  content: Sequelize.TEXT,
  // 正确答案
  answer: Sequelize.STRING(255),
  // 提示
  hint: Sequelize.STRING(255),
  // 题目状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 备注
  remark: Sequelize.STRING(255)
}, {
  sequelize: db,
  tableName: 'exercise'
})

module.exports = { Exercise }