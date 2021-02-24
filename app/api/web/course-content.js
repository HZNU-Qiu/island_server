const Router = require('koa-router')
const router = new Router({ prefix: '/web/courseContent' })
const { CourseContent } = require('../../models/course-content')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

/**
 * 获取课程内容接口
 */
router.get('/getContent/:id', new Auth(4).m, async (ctx) => {
  let chapter_id = ctx.params.id
  let { res, find } = await CourseContent.getContent(chapter_id)
  let data = res
  if (find) {
    data.dataValues.find = find
    success('ok', data)
  } else {
    success('ok', {'data': find})
  }
})

/**
 * 保存课程内容接口
 */
router.post('/saveContent', new Auth(8).m, async (ctx) => {
  let data = ctx.request.body
  let res = await CourseContent.saveContent(data)
  success('ok', res)
})

module.exports = router