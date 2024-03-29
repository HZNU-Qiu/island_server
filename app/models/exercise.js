const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Exercise extends Model {
  /**
   * 新增理论练习题(发布/草稿)
   */
  static async add(data) {
    await Exercise.create({
      ...data
    })
  }

  /**
   * 添加试题时筛选题目
   */
  static async getExercisesForPaper(data) {
    let categoryId = data.categoryId
    let difficulty = data.difficulty
    let current = data.current
    let offset = (current - 1) * 10
    let type = data.type
    let queryArr = []
    let queryCMD = ""
    if (difficulty !== 0) {
      queryArr.push(`e.difficulty = ${difficulty}`)
    }
    if (type !== 0) {
      queryArr.push(`e.type = ${type}`)
    }
    queryArr.push(`e.category_id = ${categoryId} AND e.status = 1`)
    queryCMD = queryArr.join(" AND ")
    let sql = `SELECT e.id, e.type, e.difficulty, e.content, e.options, e.answer, e.hint, e.remark, (SELECT COUNT(1) FROM exercise e WHERE ${queryCMD}) AS total
    FROM exercise e
    WHERE ${queryCMD}
    LIMIT 20 OFFSET ${offset}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }

  /**
   * 条件检索理论题库 flag
   * directionId flag-1
   * categoryId flag-2
   * difficulty flag-3
   * type flag-4
   * filter 1-all 2-status=1,creatorId 3-status=0,creatorId
   */
  static async getExercises(condition) {
    let query = []
    if (condition.directionId !== -1) {
      query.push(`e.direction_id = ${condition.directionId}`)
    }
    if (condition.categoryId !== -1) {
      query.push(`e.category_id = ${condition.categoryId}`)
    }
    if (condition.difficulty !== -1) {
      query.push(`e.difficulty = ${condition.difficulty}`)
    }
    if (condition.type !== -1) {
      query.push(`e.type = ${condition.type}`)
    }
    if (condition.filter === 2) {
      query.push(`e.status = 1 AND e.creator_id = ${condition.creatorId}`)
    } else if (condition.filter === 3) {
      query.push(`e.status = 0 AND e.creator_id = ${condition.creatorId}`)
    } else {
      query.push(`e.status = 1`)
    }
    let str = query.join(' AND ')
    let sql = `SELECT e.*, d.name AS directionName, c.name AS categoryName, u.realname AS userName,
    (SELECT COUNT(1) FROM exercise e WHERE ${str}) AS total
    FROM exercise e JOIN direction d ON e.direction_id = d.id
    JOIN category c ON c.id = e.category_id
    JOIN user u ON u.id = e.creator_id
    GROUP BY e.id
    HAVING `
    sql += str + ` limit 10 offset ${(condition.current - 1) * 10}`
    let data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
   * 根据ID获取题目详情
   */
  static async getOne(id) {
    return await Exercise.findOne({
      where: {
        id
      }
    })
  }

  /**
   * 编辑题目
   */
  static async modify(data) {
    await Exercise.update({
      ...data
    }, {
      where: {
        id: data.id
      }
    })
  }

  /**
   * 根据难度题型筛选练习
   */
  static async filterExercise(query) {
    let option = []
    let offset = (query.current - 1) * 20
    let chapterId = query.chapterId
    if (query.difficulty !== 0) {
      option.push(`e.difficulty = ${query.difficulty}`)
    }
    if (query.type !== 0) {
      option.push(`e.type = ${query.type}`)
    }
    let sql1 = `SELECT c.category_id FROM course c JOIN chapter ON c.id = chapter.course_id WHERE chapter.id = ${chapterId}`
    let res1 = await db.query(sql1, { raw: true })
    let categoryId = res1[0][0].category_id
    option.push(`e.category_id = ${categoryId}`)
    option.push(`e.status = 1`)
    let str = option.join(' AND ')
    let sql = `SELECT e.id, e.type, e.difficulty, e.content, e.options, e.answer, e.hint, e.remark, (SELECT COUNT(1) FROM exercise e WHERE ${str}) AS total
    FROM exercise e
    WHERE ${str}
    LIMIT 20 OFFSET ${offset}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }
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
  // 选项信息 用;分割
  options: Sequelize.TEXT,
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