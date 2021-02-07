const Router = require('koa-router')
const { success } = require('../../lib/helper')
const router = new Router({ prefix: '/web/teacherInfo' })
const { Auth } = require('../../../middlewares/auth')
const { TeacherInfo } = require('../../models/teacher-info')
const { User } = require('../../models/user')
const { AddTeacherValidator } = require('../../validators/teacherInfo-validator')

/**
 * 新增教师用户
 */
router.post('/addTeacher', new Auth(16).m, async (ctx) => {
  const v = await new AddTeacherValidator().validate(ctx)
  const user = {}
  const teacherData = {}
  user.username = v.get('body.username')
  user.realname = v.get('body.realname')
  user.password = v.get('body.password1')
  user.sex = v.get('body.sex')
  user.email = v.get('body.email')
  user.status = 1
  user.type = 8
  user.avatar = '/avatars/default.png'
  teacherData.universityId = v.get('body.universityId')
  teacherData.schoolId = v.get('body.schoolId')
  teacherData.departmentId = v.get('body.departmentId')
  let newuser = await User.add(user)
  teacherData.userId = newuser.id
  await TeacherInfo.add(teacherData)
  success('ok')
})

/**
 * 获取教师的个人身份信息
 */
router.get('/getinfo', new Auth(4).m, async (ctx) => {
  let id = ctx.auth.uid
  let info = await TeacherInfo.getInfo(id)
  success('ok', info)
})

/**
 * 获取教师的个人学籍信息
 */
router.get('/getStatus', new Auth(4).m, async (ctx) => {
  let id = ctx.auth.uid
  let status = await TeacherInfo.statusInfo(id)
  success('ok', status)
})

/**
 * 修改教师校内信息
 */
router.post('/modifyTeacherStatus', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  await TeacherInfo.modify(data)
  success('ok')
})

module.exports = router