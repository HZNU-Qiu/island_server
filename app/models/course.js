const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Course extends Model {
  /**
   * 创建一个课程
   */
  static async add(data) {
    await Course.create({
      ...data
    })
  }

  /**
   * 获取教师创建的所有课程
   * 未完成！！！
   * @param id 教师用户id
   */
  static async findByTeacher(id) {
    let sql = `SELECT c.id, c.name, c.description, c.difficulty, c.point, c.notice,c.objectives, c.status, t.id AS category_id, t.name AS categoryName,d.id AS direction_id, d.name AS directionName
    FROM course c JOIN category t ON c.category_id = t.id
    JOIN direction d ON c.direction_id = d.id
    WHERE c.creator_id = ${id}`
    let data = await db.query(sql, { raw: true })
    data = data[0]
    data.map((item) => {
      item.editFlag = false
      item.optionValue = [item.direction_id, item.category_id]
    })
    return data
  }
  /**
   * 编辑课程信息
   */
  static async modify(data) {
    await Course.update({
      ...data
    }, {
      where: {
        id: data.id
      }
    })
  }
  /**
   * 展示课程详情信息
   */
  static async detail(id) {
    let sql = `SELECT c.id, c.name, c.description, c.difficulty, c.point, c.notice, c.objectives, t.name AS categoryName, d.name AS directionName,u.realname,u.email,u.sex
    FROM course c JOIN user u ON c.creator_id = u.id
    JOIN category t ON c.category_id = t.id
    JOIN direction d ON c.direction_id = d.id
    WHERE c.id = ${id}`
    let data = await db.query(sql, { raw: true })
    return  data[0][0]
  }
}

Course.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 课程名称
  name: Sequelize.STRING(64),
  // 课程描述
  description: Sequelize.STRING(255),
  // 课程难度
  difficulty: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  // 课程综合评分
  point: {
    type: Sequelize.FLOAT(3, 2),
    defaultValue: 0.00
  },
  // 课程须知
  notice: Sequelize.STRING(255),
  // 课程目标
  objectives: Sequelize.STRING(255),
  // 启用标识
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  // 创建者id
  creatorId: Sequelize.INTEGER,
  // 类别
  categoryId: Sequelize.INTEGER,
  // 方向
  directionId: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'course'
})

module.exports = { Course }
