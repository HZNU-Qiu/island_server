const { db } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const bcryptjs = require('bcryptjs')
const { Auth } = require('../../middlewares/auth')
const { generateToken } = require('../../core/util')

class User extends Model {
  /**
   * 上传学生图片
   */
  static async uploadAvatar(id, url) {
    await User.update({
      avatar: url
    }, {
      where: {
        id: id
      }
    })
  }
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
    let scope = 4
    switch (user.type) {
      case 4:
        scope = Auth.STUDENT
        break
      case 8:
        scope = Auth.TEACHER
        break
      case 16:
        scope = Auth.ADMIN
        break
      default:
        throw new global.errs.ParameterException('系统异常，用户类型丢失')
    }
    const token = generateToken(user.id, scope)
    let userData = {}
    if (user.realname === null || user.sex === null) {
      userData.isComplete = false
    } else {
      userData.isComplete = true
    }
    userData.id = user.id
    userData.username = user.username
    userData.type = user.type
    userData.avatar = user.avatar
    userData.email = user.email
    return {
      token,
      userData
    }
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
   * 获取用户基础信息
   */
  static async info(id) {
    let user = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: id
      }
    })
    return user
  }

  /**
   * 管理员查询学生用户(分页)
   * @param offset 跳过数据量
   * @param status 用户状态
   * @param realname 用户姓名
   * @param type 角色类型
   */
  static async queryStudentByPage(offset) {
    let sql = `SELECT u.id,u.username,u.realname,u.sex,u.openid,u.email,u.avatar,
    un.id AS university_id, un.name AS university,
    sc.id AS school_id, sc.name AS school,
    de.id AS department_id, de.name AS department,
    ma.id AS major_id, ma.name AS major,
    cl.id AS class_id, cl.name AS classroom
    FROM user u JOIN student_info s ON u.id = s.user_id
    JOIN university un ON un.id = s.university_id
    JOIN school sc ON sc.id = s.school_id
    JOIN department de ON de.id = s.department_id
    JOIN major ma ON ma.id = s.major_id
    JOIN class cl ON cl.id = s.class_id
    WHERE u.type = 4
    LIMIT 15 OFFSET ${offset}`
    let data = await db.query(sql, { raw: true })
    return data[0]
  }

  /**
 * 管理员查询教师用户(分页)
 * @param offset 跳过数据量
 * @param status 用户状态
 * @param realname 用户姓名
 * @param type 角色类型
 */
  static async queryTeacherByPage(offset) {
    let sql = `SELECT u.id,u.username,u.realname,u.sex,u.openid,u.email,u.avatar,
    un.id AS university_id, un.name AS university,
    sc.id AS school_id, sc.name AS school,
    de.id AS department_id, de.name AS department
    FROM user u JOIN teacher_info t ON u.id = t.user_id
    JOIN university un ON un.id = t.university_id
    JOIN school sc ON sc.id = t.school_id
    JOIN department de ON de.id = t.department_id
    WHERE u.type = 8
    LIMIT 15 OFFSET ${offset}`
    let data = await db.query(sql, { raw: true })
    return data[0]
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
   * 获取用户首页信息
   */
  static async getHomePageInfo(id, scope) {
    // 系统管理员
    const { Exercise } = require('./exercise')
    const { Experiment } = require('./experiments')
    const { Course } = require('./course')
    let res, tagData, info, resData
    switch (scope) {
      case 4:
        const { StudentInfo } = require('./student-info')
        const { StudentCourse } = require('./student-course')
        res = await Promise.all([
          User.count({ where: { type: 8 } }),
          User.count({ where: { type: 4 } }),
          Exercise.count(),
          Experiment.count(),
          StudentCourse.count({ where: { studentId: id } }),
          StudentInfo.findOne({ where: { userId: id } }),
          Course.findOne({ order: [['id', 'DESC']] }),
          Course.findOne({ order: [['point', 'DESC']] })
        ])
        tagData = []
        tagData[0] = {}
        tagData[1] = {}
        tagData[2] = {}
        tagData[3] = {}
        tagData[0].title = "教师数量"
        tagData[0].data = res[0]
        tagData[1].title = "学生数量"
        tagData[1].data = res[1]
        tagData[2].title = "理论题库"
        tagData[2].data = res[2]
        tagData[3].title = "实验题库"
        tagData[3].data = res[3]
        info = {}
        info.detail1 = { number: res[4], label: '我的课程' }
        info.detail2 = { number: res[5].theoryAbility, label: '理论能力' }
        info.detail3 = { number: res[5].practiceAbility, label: '实践能力' }
        info.hot = res[6].name
        info.newest = res[7].name
        resData = {}
        resData.tagData = tagData
        resData.info = info
        return resData
      case 8:
        const { TeacherInfo } = require('./teacher-info')
        res = await Promise.all([
          User.count({ where: { type: 8 } }),
          User.count({ where: { type: 4 } }),
          Exercise.count({ where: { creatorId: id } }),
          Experiment.count({ where: { editorId: id } }),
          Course.count({ where: { creatorId: id } }),
          TeacherInfo.findOne({ where: { userId: id } }),
          Course.findOne({ order: [['id', 'DESC']] }),
          Course.findOne({ order: [['point', 'DESC']] })
        ])
        tagData = []
        tagData[0] = {}
        tagData[1] = {}
        tagData[2] = {}
        tagData[3] = {}
        tagData[0].title = "教师数量"
        tagData[0].data = res[0]
        tagData[1].title = "学生数量"
        tagData[1].data = res[1]
        tagData[2].title = "我的理论题库"
        tagData[2].data = res[2]
        tagData[3].title = "我的实验题库"
        tagData[3].data = res[3]
        info = {}
        info.detail1 = { number: res[5].popularity + 24, label: '热度' }
        info.detail2 = { number: res[4], label: '我的课程' }
        info.detail3 = { number: res[5].popularity, label: '我的学生' }
        info.hot = res[6].name
        info.newest = res[7].name
        resData = {}
        resData.tagData = tagData
        resData.info = info
        return resData
      case 16:
        const { School } = require('./school')
        res = await Promise.all([
          User.count({ where: { type: 8 } }),
          User.count({ where: { type: 4 } }),
          Exercise.count(),
          Experiment.count(),
          Course.count(),
          School.count(),
          Course.findOne({ order: [['id', 'DESC']] }),
          Course.findOne({ order: [['point', 'DESC']] })
        ])
        tagData = []
        tagData[0] = {}
        tagData[1] = {}
        tagData[2] = {}
        tagData[3] = {}
        tagData[0].title = "教师数量"
        tagData[0].data = res[0]
        tagData[1].title = "学生数量"
        tagData[1].data = res[1]
        tagData[2].title = "理论题总量"
        tagData[2].data = res[2]
        tagData[3].title = "实验题总量"
        tagData[3].data = res[3]
        info = {}
        info.detail1 = { number: res[0] + res[1], label: '用户总量' }
        info.detail2 = { number: res[4], label: '课程总量' }
        info.detail3 = { number: res[5], label: '院校总量' }
        info.hot = res[6].name
        info.newest = res[7].name
        resData = {}
        resData.tagData = tagData
        resData.info = info
        return resData
    }
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