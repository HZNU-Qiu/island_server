const Router = require('koa-router')
const router = new Router({ prefix: '/web/courseDirection' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { AddCourseDirectionValidator, ModifyCourseDirectionValidator } = require('../../validators/courseDirection-validator')
const { CourseDirection } = require('../../models/course-direction')

/**
 * 创建一个课程方向
 */
router.post('/add', new Auth(16).m, async (ctx) => {
  const v = await new AddCourseDirectionValidator().validate(ctx)
  let name = v.get('body.directionName')
  let description = v.get('body.directionDesc')
  let res = await CourseDirection.add({ name, description, status: 1 })
  console.log(res)
  let data = {}
  data.id = res.id
  data.name = res.name
  data.description = res.description
  success('ok', data)
})

/**
 * 获取所有课程方向
 */
router.get('/list', new Auth(8).m, async (ctx) => {
  let data = await CourseDirection.listAll()
  success('ok', data)
})

/**
 * 编辑学科方向
 */
router.post('/modify', new Auth(8).m, async (ctx) => {
  const v = await new ModifyCourseDirectionValidator().validate(ctx)
  let id = v.get('body.id')
  let name = v.get('body.directionName')
  let description = v.get('body.directionDesc')
  await CourseDirection.modify(id, name, description)
  success('ok')
})

module.exports = router