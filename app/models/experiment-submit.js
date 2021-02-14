const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class ExperimentSubmit extends Model {

}

ExperimentSubmit.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 学生id FK(user_id)
  student_id: Sequelize.INTEGER,
  // 实验id FK(experimentId)
  experiment_id: Sequelize.INTEGER,
  // 判题结果
  result: Sequelize.INTEGER,
  // 代码大小
  code_size: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 所用语言
  code_lang: Sequelize.STRING(64),
  // 提交代码内容
  code: Sequelize.TEXT,
  // 内存占用
  memory: Sequelize.INTEGER,
  // 耗时
  time_consumption: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'experiment_submit'
})

module.exports = { ExperimentSubmit }