const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const bcryptjs = require('bcryptjs')

class User extends Model {
  /**
   * 用户登录
   */
  static async login(username, password) {
    let user = await User.findOne({
      where: { username, status: 1 }
    })
    // 如果用户不存在
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在,或被禁用')
    }
    const correct = bcryptjs.compareSync(password, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('账号密码错误')
    }
    return user
  }

  /**
   * 管理员创建一个新增用户对象
   */
  static async add(user) {
    return await User.create({
      ...user
    })
  }

  /**
   * 管理员修改用户信息
   */
  static async modify(user) {
    return await User.update({
      ...user
    }, {
      where: {
        id: user.id
      }
    })
  }

  /**
   * 管理员查询用户(分页)
   * @param offset 跳过数据量
   * @param status 用户状态
   * @param realname 用户姓名
   * @param type 角色类型
   */
  static async queryByPage(offset, status, realname, type) {
    let sql = `SELECT * FROM user WHERE status = ${status}`
    if (realname) {
      sql += `AND realname LIKE '%${realname}%'`
    }
    if (type) {
      sql += `AND type = ${type}`
    }
    sql += `LIMIT 15 OFFSET ${offset}`
    const data = await db.query(sql, { raw: true })
    let user = {}
    user.rows = data[0]
    user.count = data[0].length
    return user
  }

  /**
   * 管理员禁用用户(软删除)
   * @param id 用户id
   */
  static async ban(id) {
    return await User.update({
      status: 0
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 管理员启用用户
   * @param id 用户id
   */
  static async activate(id) {
    return await User.update({
      status: 1
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 管理员删除人员
   * @param id 用户id
   * 待完成！！！！
   */
  static async kill(id) {

  }
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