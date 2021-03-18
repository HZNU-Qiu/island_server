const Router = require('koa-router')
const router = new Router({ prefix: '/web/courseManage' })
const { Course } = require('../../models/course')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { AddCourseValidator } = require('../../validators/courseManage-validator')

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
router.get('/detail/:id', new Auth(8).m, async (ctx) => {
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


module.exports = router