const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Chapter extends Model {
  /**
   * 新增一个章节
   */
  static async addChapter(data) {
    return await Chapter.create({
      ...data
    })
  }

  /**
   * 添加一个章节下的课程
   */
  static async addChapterCourse(data) {
    return await Chapter.create({
      ...data
    })
  }

  /**
   * 显示章节树
   */
  static async getAll(course_id) {
    let data = await db.query(`SELECT id, name, remark, number, rank, parent_id, course_id FROM chapter WHERE course_id=${course_id}`, { raw: true })
    data = data[0]
    let res = []
    data.map((item) => {
      if (item.parent_id === -1) {
        item.children = []
        data.map((child) => {
          if (child.parent_id === item.id) {
            item.children.push(child)
          }
        })
        res.push(item)
      }
    })
    return res
  }
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
  // 排序依据从1开始 代表第1节
  rank: Sequelize.INTEGER,
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