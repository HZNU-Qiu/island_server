const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Announcement extends Model {

}

Announcement.init({
  // id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 发送者id
  from: Sequelize.INTEGER,
  // 所属课程 0-系统公告
  to: Sequelize.INTEGER,
  // 标题
  headline: Sequelize.STRING(128),
  // 内容
  content: Sequelize.TEXT,
  // 状态
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: 'announcement'
})

module.exports = { Announcement }