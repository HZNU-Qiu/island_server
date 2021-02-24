const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class CourseContent extends Model {
  /**
   * 获取课程内容信息
   */
  static async getContent(chapter_id) {
    let content = await CourseContent.findOne({
      where: {
        chapter_id: chapter_id
      }
    })
    let find
    if (content === "" || content === null) {
      find = false
    } else {
      find = true
    }
    let res = {}
    res = content
    return { res, find }
  }

  /**
   * 保存课程信息
   */
  static async saveContent(data) {
    let res;
    if (!data.flag) {
      res = await CourseContent.create({
        ...data
      })
    } else {
      res = await CourseContent.update({
        ...data
      }, {
        where: {
          id: data.id
        }
      })
    }
    return res
  }
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