const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const bcryptjs = require('bcryptjs')

class User extends Model {

}

User.init({
  // 记录id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 用户名
  username: Sequelize.STRING(64),
  // 密码
  password: {
    type: Sequelize.STRING(128),
    // 观察者模式
    set(val) {
      const salt = bcryptjs.genSaltSync(10)
      const hashPassword = bcryptjs.hashSync(val, salt)
      this.setDataValue('password', hashPassword)
    }
  },
  // 真实姓名
  realname: Sequelize.STRING(32),
  // 用户邮箱
  email: {
    type: Sequelize.STRING(256),
    unique: true,// 唯一
  },
  // 性别
  sex: Sequelize.INTEGER,
  // 用户头像
  avatar: Sequelize.STRING(255),
  // 第三方id
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  },
  // 角色类型
  type: Sequelize.INTEGER,
  // 账户状态
  status: Sequelize.INTEGER
}, {
  sequelize: db,
  tableName: 'user'
})

module.exports = { User }