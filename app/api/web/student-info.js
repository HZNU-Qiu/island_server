const Router = require('koa-router')
const { success } = require('../../lib/helper')
const router = new Router({ prefix: '/web/studentInfo' })
const { Auth } = require('../../../middlewares/auth')
const { StudentInfo } = require('../../models/student-info')
const { User } = require('../../models/user')
const { StudentInfoAddValidator, AddStudentValidator } = require('../../validators/studentInfo-validator')

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
 * 新增学生用户
 */
router.post('/addStudent', new Auth(16).m, async (ctx) => {
  const v = await new AddStudentValidator().validate(ctx)
  const user = {}
  const studentData = {}
  user.username = v.get('body.username')
  user.realname = v.get('body.realname')
  user.password = v.get('body.password1')
  user.sex = v.get('body.sex')
  user.email = v.get('body.email')
  user.status = 1
  user.type = 4
  user.avatar = '/avatars/default.png'
  studentData.universityId = v.get('body.university_id')
  studentData.schoolId = v.get('body.school_id')
  studentData.departmentId = v.get('body.department_id')
  studentData.majorId = v.get('body.major_id')
  studentData.classId = v.get('body.class_id')
  let newuser = await User.add(user)
  studentData.userId = newuser.id
  await StudentInfo.add(studentData)
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

/**
 * 保存学生学籍信息
 */
router.post('/modifyStudentStatus', new Auth(16).m, async (ctx) => {
  let data = ctx.request.body
  await StudentInfo.modify(data)
  success('ok')
})


module.exports = router