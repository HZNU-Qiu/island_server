const Router = require('koa-router')
const { success } = require('../../lib/helper')
const router = new Router({ prefix: '/web/studentInfo' })
const { Auth } = require('../../../middlewares/auth')
const { StudentInfo } = require('../../models/student-info')
const { User } = require('../../models/user')
const { StudentInfoAddValidator } = require('../../validators/studentInfo-validator')

/**
 * 学生用户信息完善
 */
router.post('/infoComplete', new Auth(4).m, async (ctx) => {
  const v = await new StudentInfoAddValidator().validate(ctx)
  const user = {}
  const student = {}
  user.id = ctx.auth.uid
  user.realname = v.get('body.realName')
  user.sex = v.get('body.sex')
  student.userId = ctx.auth.uid
  student.universityId = v.get('body.universityId')
  student.schoolId = v.get('body.schoolId')
  student.departmentId = v.get('body.departmentId')
  student.majorId = v.get('body.majorId')
  student.classId = v.get('body.classId')
  await User.modify(user)
  await StudentInfo.add(student)
  success('ok')
})

/**
 * 获取学生的个人身份信息
 */
router.get('/getinfo', new Auth(4).m, async (ctx) => {
  let id = ctx.auth.uid
  let info = await StudentInfo.getInfo(id)
  success('ok', info)
})

/**
 * 获取学生的个人学籍信息
 */
router.get('/getStatus', new Auth(4).m, async (ctx) => {
  let id = ctx.auth.uid
  let status = await StudentInfo.statusInfo(id)
  success('ok', status)
})

module.exports = router