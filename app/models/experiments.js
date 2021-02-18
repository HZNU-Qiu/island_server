const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Experiment extends Model {

}

Experiment.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 题目id
  displayId: {
    type: Sequelize.INTEGER,
    unique: true
  },
  // 题目名称
  title: Sequelize.STRING(255),
  // 题目描述
  content: Sequelize.TEXT,
  // 输入描述
  input_desc: Sequelize.TEXT,
  // 输出描述
  output_desc: Sequelize.TEXT,
  // 输入样例
  input_sample: Sequelize.STRING(255),
  // 输出样例
  output_sample: Sequelize.STRING(255),
  // 提示信息
  hint: Sequelize.STRING(255),
  // 创作者ID FK(user_id)
  editorId: Sequelize.INTEGER,
  // 使用语言 用逗号分割 c,cpp,java,py3
  language: Sequelize.STRING(64),
  // 最大CPU占用时间
  max_cpu_time: Sequelize.INTEGER,
  // 最大运行内存
  max_memory: Sequelize.INTEGER,
  // 题目类型 1-常规题 2-模板填空
  type: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 模板
  template: Sequelize.TEXT,
  // 难度 1-简单 2-中等 3-困难
  difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 题目状态 0-弃用 1-学生可见 2-学生不可见
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 2
  },
  // 题目标签 FK(label_id) 所属标签 逗号连接 1，2，3
  label: Sequelize.STRING(255),
  // 所属类别id FK(course_id)
  categoryId: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'experiments'
})

module.exports = { Experiment }