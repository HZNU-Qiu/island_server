const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseContent extends Model {

}

CourseContent.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 课程内容
  content: Sequelize.TEXT,
  // 是否可见
  visible: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  chapter_id: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'course_content'
})

module.exports = { CourseContent }