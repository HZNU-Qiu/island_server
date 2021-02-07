const Router = require('koa-router')
const router = new Router({ prefix: '/web/courseCategory' })
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')
const { CourseCategory } = require('../../models/course-category')
const { ListTagsValidator } = require('../../validators/courseCategory-validator')

/**
 * 创建一个课程类别
 */
router.post('/add', new Auth(16).m, async (ctx) => {
  
})

/**
 * 获取所有课程类别
 */
router.get('/list/:id', new Auth(8).m, async (ctx) => {
  const v = await new ListTagsValidator().validate(ctx)
  let id = v.get('path.id')
  let data = await CourseCategory.list(id)
  success('ok', data)
})

/**
 * 编辑学科类别
 */
router.post('/modify', new Auth(8).m, async (ctx) => {
  
})

module.exports = router