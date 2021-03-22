const Router = require('koa-router')
const router = new Router({ prefix: '/web/courseManage' })
const { Course } = require('../../models/course')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { AddCourseValidator } = require('../../validators/courseManage-validator')
const { StudentCourse } = require('../../models/student-course')

/**
 * 创建课程接口
 */
router.post('/add', new Auth(8).m, async (ctx) => {
  const uid = ctx.auth.uid
  const v = await new AddCourseValidator().validate(ctx)
  let course = v.get('body')
  course.creatorId = uid
  await Course.add(course)
  success('ok')
})

/**
 * 获取教师创建的所有课程
 */
router.get('/listByTeacherId', new Auth(8).m, async (ctx) => {
  const uid = ctx.auth.uid
  let data = await Course.findByTeacher(uid)
  success('ok', data)
})

/**
 * 编辑课程
 */
router.post('/modify', new Auth(8).m, async (ctx) => {
  const data = ctx.request.body
  await Course.modify(data)
  success('ok')
})

/**
 * 获取课程详情
 */
router.get('/detail/:id', new Auth(4).m, async (ctx) => {
  const id = ctx.params.id
  let data = await Course.detail(id)
  success('ok', data)
})

/**
 * 获取课程树
 */
router.get('/getCourseTree', new Auth(4).m, async () => {
  let data = await Course.getCourseTree();
  success('ok', data)
})

/**
 * 根据方向、类别、难度、是否是用户课程筛选课程信息
 */
router.post('/filterCourse', new Auth(4).m, async (ctx) => {
  let body = ctx.request.body
  let uid = ctx.auth.uid
  body.studentId = uid
  let data
  if (body.filter === 0) {
    data = await Course.filterCourse(body)
    success('ok', data)
  } else {
    let x = {}
    x.rows = await StudentCourse.filterMyCourse(body)
    if (x.rows.length !== 0) {
      x.count = x.rows[0].total
    } else {
      x.count = 0
    }
    success('ok', x)
  }
})


module.exports = router