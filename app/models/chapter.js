const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Chapter extends Model {

}

Chapter.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 章节名称
  name: Sequelize.STRING(255),
  // 备注
  remark: Sequelize.STRING(255),
  // 所含题目数量
  number: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 父节点ID
  parentId: {
    type: Sequelize.INTEGER,
    defaultValue: -1
  },
  // 所属课程ID
  courseId: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'chapter'
})

module.exports = { Chapter }