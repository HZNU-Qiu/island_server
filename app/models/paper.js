const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Paper extends Model {
  /**
   * 筛选试卷
   */
  static async filterPapers(data) {
    let current = data.current
    let offset = (current - 1) * 15
    let type = data.type
    let filter = data.filter
    let categoryIds = data.categoryIds
    let difficulty = data.difficulty
    let status = 1
    let queryCMD = ``
    let queryArr = []
    queryArr.push(`p.type = ${type}`)
    if (difficulty !== -1) {
      queryArr.push(`p.difficulty = ${difficulty}`)
    }
    switch (filter) {
      case 1:
        status = 1
        queryArr.push(`p.status = 1`)
        break
      case 2:
        status = 1
        queryArr.push(`p.status = 1 AND p.creator_id = ${data.creatorId}`)
        break
      case 3:
        status = 0
        queryArr.push(`p.status = 0 AND p.creator_id = ${data.creatorId}`)
        break
    }
    if (categoryIds.length !== 0) {
      queryArr.push(`p.category_id in (${categoryIds})`)
    }
    queryCMD = queryArr.join(' AND ')
    let sql = `SELECT p.id, p.title, p.point, p.difficulty, p.type, p.direction_id AS directionId, p.category_id AS categoryId, u.realname, 
    (SELECT COUNT(1) FROM paper p JOIN user u ON u.id = p.creator_id WHERE ${queryCMD}) AS total
    FROM paper p JOIN user u ON u.id = p.creator_id 
    WHERE ${queryCMD} 
    LIMIT 15 OFFSET ${offset}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }

  /**
   * 新增试卷模板
   */
  static async addPaper(data) {
    if (data.isModify) {
      delete data.isModify
      await Paper.update({
        ...data
      }, {
        where: {
          id: data.id
        }
      })
    } else {
      delete data.isModify
      return await Paper.create({
        ...data
      })
    }
  }

  /**
   * 获取试卷信息
   */
  static async getPaperInfo(id) {
    return await Paper.findOne({
      where: {
        id
      }
    })
  }

  /**
   * 获取试卷题目
   */
  static async getPaperExercises(id) {
    let sql = `SELECT e.*, p.id, p.point, p.paper_id 
    FROM paper_exercises p LEFT JOIN exercise e ON p.exercise_id = e.id
    WHERE p.paper_id = ${id}`
    let res = await db.query(sql, { raw: true })
    return res[0]
  }

  /**
   * 根据categoryId获取试卷信息
   */
  static async getPapersByCategory(id) {
    return await Paper.findAll({
      where: {
        categoryId: id,
        status: 1,
        type: 1
      }
    })
  }
}

Paper.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 卷头
  title: Sequelize.STRING(128),
  // 试卷类型 1-正式 2-模拟
  type: Sequelize.INTEGER,
  // 状态 0-草稿 1-发布
  status: Sequelize.INTEGER,
  // 创建者ID
  creatorId: Sequelize.INTEGER,
  // 总分
  point: Sequelize.INTEGER,
  // 方向id
  directionId: Sequelize.INTEGER,
  // 类别id
  categoryId: Sequelize.INTEGER,
  // 难度
  difficulty: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'paper'
})

module.exports = { Paper }