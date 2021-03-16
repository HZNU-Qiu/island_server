const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class StudentChapter extends Model {
 
}

StudentChapter.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户id
  userId: Sequelize.INTEGER,
  // 章节id
  chapterId: Sequelize.INTEGER,
  // 成绩 1-A 2-B 3-C
  grade: Sequelize.INTEGER,
}, {
  sequelize: db,
  tableName: 'student_chapter'
})

module.exports = { StudentChapter }